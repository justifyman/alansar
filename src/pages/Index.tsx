import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import thumbnail1 from "@/assets/thumbnail-1.jpg";
import thumbnail2 from "@/assets/thumbnail-2.jpg";
import thumbnail3 from "@/assets/thumbnail-3.jpg";
import thumbnail4 from "@/assets/thumbnail-4.jpg";
import thumbnail5 from "@/assets/thumbnail-5.jpg";
import thumbnail6 from "@/assets/thumbnail-6.jpg";

const Index = () => {
  const trendingNow = [
    { image: thumbnail1, title: "Shadow Protocol" },
    { image: thumbnail2, title: "Love in Paris" },
    { image: thumbnail3, title: "Beyond the Stars" },
    { image: thumbnail4, title: "The Comedy Club" },
    { image: thumbnail5, title: "Dark Whispers" },
    { image: thumbnail6, title: "The Quest Begins" },
  ];

  const popularOnAlAnsar = [
    { image: thumbnail3, title: "Galactic Odyssey" },
    { image: thumbnail5, title: "Midnight Terror" },
    { image: thumbnail1, title: "Action Force" },
    { image: thumbnail6, title: "Epic Fantasy" },
    { image: thumbnail2, title: "Hearts Entwined" },
    { image: thumbnail4, title: "Laugh Out Loud" },
  ];

  const newReleases = [
    { image: thumbnail6, title: "Dragon's Legacy" },
    { image: thumbnail4, title: "Comedy Central" },
    { image: thumbnail5, title: "Horror House" },
    { image: thumbnail2, title: "Romance Tonight" },
    { image: thumbnail3, title: "Space Warriors" },
    { image: thumbnail1, title: "Strike Force" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <div className="relative -mt-20 lg:-mt-32 z-10 pb-16">
          <ContentRow title="Trending Now" videos={trendingNow} />
          <ContentRow title="Popular on AlAnsarMedia" videos={popularOnAlAnsar} />
          <ContentRow title="New Releases" videos={newReleases} />
        </div>
      </main>
    </div>
  );
};

export default Index;
