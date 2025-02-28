import { BaseTemplateConfig } from "@/lib/templates/template-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: BaseTemplateConfig;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function TemplateCard({
  template,
  onSelect,
  disabled,
}: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardFooter className="flex flex-col items-start gap-2 p-4">
            <div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onSelect(template.id)}
              disabled={disabled}
            >
              Use template
            </Button>
          </CardFooter>
        </motion.div>
      </Card>
    </motion.div>
  );
}
