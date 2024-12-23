// components/templates/vibrant-visionary/index.tsx
import { TemplateProps } from "@/lib/templates/template-types";
import {
  Header,
  Carousel,
  MediaCard,
  MasonryGrid,
  SocialLinks,
  CallToAction,
  FeaturedLink,
  Testimonials,
  Footer,
  Embed,
} from "@/components/templates-shared";
import { defaultTheme } from "./theme";

export const runtime = "edge";

function VibrantVisionaryTemplate({ data, isPreview = false }: TemplateProps) {
  const theme = defaultTheme;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Header Section */}
      <Header
        className="p-4 flex items-center justify-center"
        profileImage={data.profile.image}
        name={data.profile.name}
        bio={data.profile.bio}
      />

      {/* Featured Media Carousel */}
      <Carousel
        className="mt-8"
        items={[
          <MediaCard key="1" imageUrl="/assets/images/abdul_pfp.jpg" />,
          <MediaCard key="2" imageUrl="/assets/images/abdul_pfp.jpg" />,
          <MediaCard key="3" videoUrl="/assets/images/abdul_pfp.jpg" />,
        ]}
      />

      {/* About Section with Masonry Grid */}
      <MasonryGrid className="mt-8 p-4" gap={16}>
        <MediaCard
          imageUrl="https://picsum.photos/200/400"
          title="My Photography"
          className="col-span-2"
        />
        <MediaCard
          title="About Me"
          description="I'm a passionate creator who loves to explore the world through a visual lens."
          className="col-span-1"
        />
        <Embed
          embedUrl='<iframe width="560" height="315" src="https://youtu.be/4eGSuf0oM0s?si=b42UZdfwtS6d8j1v" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
          className="col-span-1"
        />
        <MediaCard
          imageUrl="https://picsum.photos/200/300"
          className="col-span-1"
        />
      </MasonryGrid>

      {/* Social Links */}
      <SocialLinks className="mt-8 flex justify-center" links={data.socials} />

      {/* Call to Action */}
      <CallToAction
        className="mt-8 text-center"
        buttonText="Explore My Portfolio"
        buttonLink="/portfolio"
      />

      {/* Featured Link */}
      <FeaturedLink
        className="mt-8"
        title="Check Out My Latest Project"
        url="/project/latest"
        backgroundColor={theme.colors.accent}
        textColor={theme.colors.background}
      />

      {/* Testimonials */}
      <Testimonials
        className="mt-8 p-4"
        testimonials={[
          {
            quote: "Absolutely stunning work! The visuals are breathtaking.",
            author: "Jane Doe",
            authorTitle: "Art Critic",
          },
          {
            quote: "A true visionary! The creativity is off the charts.",
            author: "John Smith",
            authorTitle: "Photographer",
          },
        ]}
      />

      {/* Footer */}
      <Footer
        className="mt-8"
        text={`© ${new Date().getFullYear()} ${data.profile.name}`}
      />
    </div>
  );
}

export default VibrantVisionaryTemplate;
