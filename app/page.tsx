import { MovieHaikuGuess } from "@/components/movie-haiku-guess";
import { Providers } from "@/components/providers";
import { FaGithub } from "react-icons/fa";

export default function Page() {
  return (
    <Providers>
      <MovieHaikuGuess />
      <a
        href="https://github.com/omniphx/reel-haikus"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
      >
        <FaGithub className="text-2xl" />
        <span className="text-sm">View on GitHub</span>
      </a>
    </Providers>
  );
}
