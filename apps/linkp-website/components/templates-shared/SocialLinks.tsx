import Link from "next/link";

type SocialLinksProps = {
  links: Array<{ platform: string; url: string; icon: string }>;
  className?: string;
};

function SocialLinks({ links, className = "" }: SocialLinksProps) {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {links.map((link) => (
        <Link key={link.platform} href={link.url} legacyBehavior>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <i className={`fab fa-${link.icon}`}></i>
          </a>
        </Link>
      ))}
    </div>
  );
}

export default SocialLinks;
