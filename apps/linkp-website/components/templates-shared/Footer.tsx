type FooterProps = {
  text?: string;
  className?: string;
};

function Footer({ text, className = "" }: FooterProps) {
  return (
    <footer className={`py-4 text-center ${className}`}>
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </footer>
  );
}

export default Footer;
