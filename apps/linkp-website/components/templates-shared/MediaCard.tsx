import Image from "next/image";
import Link from "next/link";

type MediaCardProps = {
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  className?: string;
};

function MediaCard({
  imageUrl,
  videoUrl,
  title,
  description,
  linkUrl,
  className = "",
}: MediaCardProps) {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title || "Image"}
          width={500}
          height={300}
          className="w-full h-auto object-cover"
        />
      )}
      {videoUrl && (
        <video
          controls
          className="w-full h-auto"
          src={videoUrl}
          title={title}
        />
      )}
      {(title || description) && (
        <div className="p-4">
          {title && <h3 className="text-xl font-bold">{title}</h3>}
          {description && <p className="text-gray-600">{description}</p>}
          {linkUrl && (
            <Link href={linkUrl} legacyBehavior>
              <a className="text-blue-500 hover:underline mt-2 inline-block">
                Learn More
              </a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default MediaCard;
