type QuoteType =
  | "entry"
  | "right"
  | "input-current-correct-error"
  | "input-current-error-error"
  | "input-current-correct"
  | "error"
  | "current"
  | "post-current"
  | "current-space"
  | "current-error";
export default function Quote({
  content,
  type,
}: {
  content: string;
  type: QuoteType;
}) {
  let className: string = "aspect-square ";

  switch (type) {
    case "entry": {
      className += "text-green-600 hidden sm:inline";
      break;
    }
    case "input-current-correct-error": {
      className += "underline underline-offset-2 decoration-2 text-green-600";
      break;
    }
    case "input-current-error-error": {
      className += "underline underline-offset-2 decoration-2 bg-red-600";
      break;
    }
    case "input-current-correct": {
      className += "text-green-600 underline decoration-2 underline-offset-2";
      break;
    }
    case "error": {
      className += "bg-red-600";
      break;
    }
    case "current": {
      className +=
        'relative underline decoration-2 underline-offset-2 before:absolute before:top-1/2 before:-left-0 before:-translate-1/2 before:animate-typing before:content-["|"]';
      break;
    }
    case "post-current": {
      className += "underline decoration-2 underline-offset-2";
      break;
    }
    case "current-error": {
      className +=
        'relative before:absolute before:top-1/2 before:-left-0 before:-translate-1/2 before:animate-typing before:content-["|"]';
      break;
    }
    case "current-space": {
      className +=
        'relative before:absolute before:top-1/2 before:-left-0 before:-translate-1/2 before:animate-typing before:content-["|"]';
      break;
    }
    case "right": {
      className += "";
      break;
    }
  }

  return (
    <span className={className}>
      {content === " " ? <span>&nbsp;</span> : content}
    </span>
  );
}
