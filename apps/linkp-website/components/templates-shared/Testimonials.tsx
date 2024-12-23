type Testimonial = {
  quote: string;
  author: string;
  authorTitle?: string;
};

type TestimonialsProps = {
  testimonials: Testimonial[];
  className?: string;
};

function Testimonials({ testimonials, className = "" }: TestimonialsProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-200"
        >
          <p className="text-gray-800 italic">
            &quot;{testimonial.quote}&quot;
          </p>
          <p className="mt-2 text-gray-600 font-medium">
            - {testimonial.author}
            {testimonial.authorTitle && (
              <span className="text-gray-500 text-sm">
                , {testimonial.authorTitle}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Testimonials;
