import { Hero } from './Hero';
import { FeaturedCases } from './FeaturedCases';
import { LiveFeed } from './LiveFeed';
import { Features } from './Features';

export function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCases />
      <LiveFeed />
      <Features />
    </div>
  );
}
