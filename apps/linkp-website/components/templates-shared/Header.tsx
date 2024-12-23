import Image from "next/image";

type HeaderProps = {
  profileImage?: string;
  name?: string;
  bio?: string;
  className?: string;
};

function Header({ profileImage, name, bio, className = "" }: HeaderProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {profileImage && (
        <Image
          src={profileImage}
          alt={name || "Profile"}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
      <div>
        {name && <h1 className="text-2xl font-bold">{name}</h1>}
        {bio && <p className="text-gray-600">{bio}</p>}
      </div>
    </div>
  );
}

export default Header;
