// This is ugly, but we couldn't get string concatenation to do the trick

interface StatusInfo {
  color: string;
  br?: string;
}

type StatusMap = Record<string, StatusInfo>;

const statuses: StatusMap = {
  published: {
    color: "bg-success",
    br: "Publicado",
  },
  draft: {
    color: "bg-[#ffc500]",
    br: "Rascunho",
  },
  hidden: {
    color: "bg-grayMedium",
    br: "Oculto",
  },
  default: {
    color: "bg-[#FF00FF]",
  },
};

export default statuses;
