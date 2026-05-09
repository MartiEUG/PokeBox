import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  balance: number;
  level: number;
}

export interface Item {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  value: number;
  obtainedAt: string;
  caseId: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addToInventory: (item: Omit<Item, 'id' | 'obtainedAt'>) => Promise<void>;
  getInventory: () => Promise<Item[]>;
  recordCaseOpening: (caseId: number, caseName: string, item: Item) => Promise<void>;
  removeFromInventory: (itemId: string) => Promise<void>;
  tradeItem: (offeredItemId: string, newItem: Omit<Item, 'id' | 'obtainedAt'>) => Promise<void>;
  inventory: Item[];
  refreshInventory: () => Promise<void>;
  removeItems: (itemIds: string[]) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'obtainedAt'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage immediately
  const getInitialAuthState = () => {
    const localSession = localStorage.getItem('pokebox_session');
    if (localSession) {
      try {
        const user = JSON.parse(localSession);
        return { user, isAuthenticated: true, loading: false };
      } catch (e) {
        return { user: null, isAuthenticated: false, loading: true };
      }
    }
    return { user: null, isAuthenticated: false, loading: true };
  };

  const initialState = getInitialAuthState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [loading, setLoading] = useState(initialState.loading);
  const [inventory, setInventory] = useState<Item[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    // If already authenticated from localStorage, load inventory and verify with Supabase if configured
    if (isAuthenticated && user) {
      loadLocalInventory(user.id);
      
      // Try to verify with Supabase if configured
      if (supabase && isSupabaseConfigured) {
        supabase.auth.getSession().catch(err => console.warn('Supabase session check failed:', err));
      }
      return;
    }

    // Otherwise try Supabase
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setInventory([]);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, supabase, isSupabaseConfigured]);

  // Load inventory when user changes
  useEffect(() => {
    if (user && isAuthenticated) {
      refreshInventory();
    }
  }, [user, isAuthenticated]);

  const loadLocalInventory = (userId: string) => {
    const allInventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
    const userItems = allInventory
      .filter((item: any) => item.userId === userId)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        rarity: item.rarity,
        value: item.value,
        obtainedAt: item.obtainedAt,
        caseId: item.caseId,
      }));
    setInventory(userItems);
  };

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          createdAt: data.created_at,
          balance: parseFloat(data.balance),
          level: data.level,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate password length
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Validate username length
      if (username.length < 3 || username.length > 20) {
        return { success: false, message: 'Username must be between 3 and 20 characters' };
      }

      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        try {
          // Check if username already exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

          if (existingUser) {
            return { success: false, message: 'Username already taken' };
          }

          // Sign up with Supabase Auth
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: username,
              },
            },
          });

          if (signUpError) {
            if (signUpError.message.includes('already registered')) {
              return { success: false, message: 'Email already registered' };
            }
            throw signUpError;
          }

          if (!authData.user) {
            return { success: false, message: 'Registration failed. Please try again.' };
          }

          // Update the user profile with the username
          const { error: updateError } = await supabase
            .from('users')
            .update({ username })
            .eq('id', authData.user.id);

          if (updateError) {
            console.error('Error updating username:', updateError);
          }

          // Fetch the complete profile
          await fetchUserProfile(authData.user.id);

          return { success: true, message: 'Registration successful!' };
        } catch (supabaseError) {
          console.warn('Supabase registration failed, trying localStorage:', supabaseError);
          // Fall through to localStorage
        }
      }

      // Use localStorage fallback
      const users = JSON.parse(localStorage.getItem('pokebox_users') || '[]');

      const emailExists = users.some((u: User) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return { success: false, message: 'Email already registered' };
      }

      const usernameExists = users.some((u: User) => u.username.toLowerCase() === username.toLowerCase());
      if (usernameExists) {
        return { success: false, message: 'Username already taken' };
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        email,
        createdAt: new Date().toISOString(),
        balance: 1000,
        level: 1,
      };

      const passwords = JSON.parse(localStorage.getItem('pokebox_passwords') || '{}');
      passwords[newUser.id] = password;
      localStorage.setItem('pokebox_passwords', JSON.stringify(passwords));

      users.push(newUser);
      localStorage.setItem('pokebox_users', JSON.stringify(users));

      localStorage.setItem('pokebox_session', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              return { success: false, message: 'Invalid email or password' };
            }
            // If Supabase fails, fall back to localStorage
            throw new Error(error.message);
          }

          if (!data.user) {
            return { success: false, message: 'Login failed. Please try again.' };
          }

          await fetchUserProfile(data.user.id);
          return { success: true, message: 'Login successful!' };
        } catch (supabaseError) {
          console.warn('Supabase login failed, trying localStorage:', supabaseError);
          // Fall through to localStorage
        }
      }

      // Use localStorage fallback
      const users = JSON.parse(localStorage.getItem('pokebox_users') || '[]');
      const passwords = JSON.parse(localStorage.getItem('pokebox_passwords') || '{}');

      const foundUser = users.find(
        (u: User) =>
          u.email.toLowerCase() === email.toLowerCase() ||
          u.username.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        return { success: false, message: 'User not found' };
      }

      if (passwords[foundUser.id] !== password) {
        return { success: false, message: 'Incorrect password' };
      }

      localStorage.setItem('pokebox_session', JSON.stringify(foundUser));
      setUser(foundUser);
      setIsAuthenticated(true);
      loadLocalInventory(foundUser.id);

      return { success: true, message: 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('pokebox_session');
    localStorage.removeItem('pokebox_users');
    localStorage.removeItem('pokebox_passwords');
    setUser(null);
    setIsAuthenticated(false);
    setInventory([]);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        const dbUpdates: any = {};
        if (updates.balance !== undefined) dbUpdates.balance = updates.balance;
        if (updates.level !== undefined) dbUpdates.level = updates.level;
        if (updates.username !== undefined) dbUpdates.username = updates.username;

        const { error } = await supabase
          .from('users')
          .update(dbUpdates)
          .eq('id', user.id);

        if (error) throw error;

        setUser({ ...user, ...updates });
      } else {
        // Use localStorage fallback
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        const users = JSON.parse(localStorage.getItem('pokebox_users') || '[]');
        const userIndex = users.findIndex((u: User) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('pokebox_users', JSON.stringify(users));
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addToInventory = async (item: Omit<Item, 'id' | 'obtainedAt'>) => {
    if (!user) return;

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        const { error } = await supabase.from('inventory').insert({
          user_id: user.id,
          item_name: item.name,
          rarity: item.rarity,
          value: item.value,
          case_id: item.caseId,
        });

        if (error) throw error;
      } else {
        // Use localStorage fallback
        const inventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
        const newItem: Item = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...item,
          obtainedAt: new Date().toISOString(),
        };
        inventory.push({ ...newItem, userId: user.id });
        localStorage.setItem('pokebox_inventory', JSON.stringify(inventory));
      }
    } catch (error) {
      console.error('Error adding to inventory:', error);
    }
  };

  const getInventory = async (): Promise<Item[]> => {
    if (!user) return [];

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_listed', false)
          .order('obtained_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((item) => ({
          id: item.id,
          name: item.item_name,
          rarity: item.rarity as any,
          value: parseFloat(item.value),
          obtainedAt: item.obtained_at,
          caseId: item.case_id,
        }));
      } else {
        // Use localStorage fallback
        const inventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
        return inventory
          .filter((item: any) => item.userId === user.id)
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            rarity: item.rarity,
            value: item.value,
            obtainedAt: item.obtainedAt,
            caseId: item.caseId,
          }));
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  };

  const recordCaseOpening = async (caseId: number, caseName: string, item: Item) => {
    if (!user) return;

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        const { error } = await supabase.from('case_openings').insert({
          user_id: user.id,
          case_id: caseId,
          case_name: caseName,
          item_name: item.name,
          rarity: item.rarity,
          value: item.value,
        });

        if (error) throw error;
      } else {
        // Use localStorage fallback
        const openings = JSON.parse(localStorage.getItem('pokebox_openings') || '[]');
        openings.push({
          id: `opening_${Date.now()}`,
          userId: user.id,
          caseId,
          caseName,
          itemName: item.name,
          rarity: item.rarity,
          value: item.value,
          openedAt: new Date().toISOString(),
        });
        localStorage.setItem('pokebox_openings', JSON.stringify(openings));
      }
    } catch (error) {
      console.error('Error recording case opening:', error);
    }
  };

  const removeFromInventory = async (itemId: string) => {
    if (!user) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('inventory')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const inventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
        const updated = inventory.filter((item: any) => !(item.id === itemId && item.userId === user.id));
        localStorage.setItem('pokebox_inventory', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error removing from inventory:', error);
    }
  };

  const tradeItem = async (offeredItemId: string, newItem: Omit<Item, 'id' | 'obtainedAt'>) => {
    if (!user) return;
    try {
      await removeFromInventory(offeredItemId);
      await addToInventory(newItem);
    } catch (error) {
      console.error('Error trading item:', error);
      throw error;
    }
  };

  const refreshInventory = async () => {
    const items = await getInventory();
    setInventory(items);
  };

  const removeItems = async (itemIds: string[]) => {
    if (!user) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('inventory')
          .delete()
          .in('id', itemIds)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const inventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
        const updated = inventory.filter((item: any) => !itemIds.includes(item.id) || item.userId !== user.id);
        localStorage.setItem('pokebox_inventory', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error removing items:', error);
    }
  };

  const addItem = async (item: Omit<Item, 'id' | 'obtainedAt'>) => {
    if (!user) return;

    try {
      if (isSupabaseConfigured && supabase) {
        // Use Supabase
        const { error } = await supabase.from('inventory').insert({
          user_id: user.id,
          item_name: item.name,
          rarity: item.rarity,
          value: item.value,
          case_id: item.caseId,
        });

        if (error) throw error;
      } else {
        // Use localStorage fallback
        const inventory = JSON.parse(localStorage.getItem('pokebox_inventory') || '[]');
        const newItem: Item = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...item,
          obtainedAt: new Date().toISOString(),
        };
        inventory.push({ ...newItem, userId: user.id });
        localStorage.setItem('pokebox_inventory', JSON.stringify(inventory));
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        addToInventory,
        getInventory,
        recordCaseOpening,
        removeFromInventory,
        tradeItem,
        inventory,
        refreshInventory,
        removeItems,
        addItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}