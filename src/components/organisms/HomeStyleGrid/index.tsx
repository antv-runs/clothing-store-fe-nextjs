import Link from "next/link";
import { Heading } from "@/components/atoms/Heading";
import Image from "next/image";
import { Text } from "@/components/atoms/Text";
import "./index.scss";

const HOME_STYLE_CARDS = [
  {
    title: "Casual",
    imagePath: "/images/pic_style_casual.png",
    cardSize: "small" as const,
    to: "/",
  },
  {
    title: "Formal",
    imagePath: "/images/pic_style_formal.png",
    cardSize: "large" as const,
    to: "/",
  },
  {
    title: "Party",
    imagePath: "/images/pic_style_party.png",
    cardSize: "large" as const,
    to: "/",
  },
  {
    title: "Gym",
    imagePath: "/images/pic_style_gym.png",
    cardSize: "small" as const,
    to: "/",
  },
];

export const HomeStyleGrid: React.FC = () => {
  return (
    <section className="home-styles" aria-labelledby="home-styles-title">
      <div className="home-styles__box">
        <Heading as="h2" id="home-styles-title">
          BROWSE BY DRESS STYLE
        </Heading>

        <div className="home-styles__grid">
          {HOME_STYLE_CARDS.map((item) => (
            <Link
              key={item.title}
              href={item.to}
              className={`home-style-card home-style-card--${item.cardSize}`}
            >
              <Text as="span">{item.title}</Text>
              <Image
                src={item.imagePath}
                alt={`${item.title} style`}
                fill
                sizes={
                  item.cardSize === "small"
                    ? "(max-width: 992px) 100vw, 407px"
                    : "(max-width: 992px) 100vw, 684px"
                }
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
