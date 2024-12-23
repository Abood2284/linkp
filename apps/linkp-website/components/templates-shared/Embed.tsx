type EmbedProps = {
  embedUrl: string;
  className?: string;
};

function Embed({ embedUrl, className = "" }: EmbedProps) {
  // NOTE: For security reasons, you should validate and sanitize the embedUrl
  // before using it. This is a simplified example.
  return (
    <div
      className={`aspect-w-16 aspect-h-9 ${className}`}
      dangerouslySetInnerHTML={{ __html: embedUrl }}
    />
  );
}

export default Embed;
