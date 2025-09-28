import RecentTracksList from '@/components/RecentTracksList';

export default function Home() {
  return (
    <main className="bg-neutral-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Recently Played</h1>
          <p className="mt-4 text-lg text-neutral-300">A look at what I've been listening to, powered by Last.fm.</p>
        </header>
        
        <section>
          <RecentTracksList />
        </section>

        <footer className="text-center mt-12 text-neutral-500">
          <p>Built with Next.js, Tailwind CSS, and the Last.fm API.</p>
        </footer>
      </div>
    </main>
  );
}
