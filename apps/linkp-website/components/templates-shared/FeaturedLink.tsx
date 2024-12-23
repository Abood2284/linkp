import Link from "next/link";

type FeaturedLinkProps = {
  title: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
};

function FeaturedLink({
  title,
  url,
  backgroundColor = "bg-gray-200",
  textColor = "text-gray-800",
  className = "",
}: FeaturedLinkProps) {
  return (
    <div className={`p-4 rounded-lg ${backgroundColor} ${className}`}>
      <Link href={url} legacyBehavior>
        <a className={`block text-center ${textColor}`}>{title}</a>
      </Link>
    </div>
  );
}

export default FeaturedLink;
