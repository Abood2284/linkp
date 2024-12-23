import Link from "next/link";

type CallToActionProps = {
  buttonText: string;
  buttonLink: string;
  className?: string;
};

function CallToAction({
  buttonText,
  buttonLink,
  className = "",
}: CallToActionProps) {
  return (
    <div className={className}>
      <Link href={buttonLink} legacyBehavior>
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
          {buttonText}
        </a>
      </Link>
    </div>
  );
}

export default CallToAction;
