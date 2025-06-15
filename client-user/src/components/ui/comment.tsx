import { Avatar, Code } from "@nextui-org/react";
import { CommentType } from "types/type";
import { formatDate } from "../../utils/utils";

const CommentUi = ({ d }: { d: CommentType }) => {
  return <div className="w-4/5 text-zinc-900 flex items-center justify-center my-2 !-z-0">
  <Avatar isBordered radius="sm" src={d.img !== "" ? d.img : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} />
  <div className="w-4/5 h-auto min-h-[50px] mx-2">
      <div className="w-full flex justify-between">
          <p className="font-semibold font-mono">{d.nameUser}</p>
          <p>{formatDate((d.created_date ? d.created_date : d.dateComment) as string)}</p>
      </div>
      <Code style={{ color: "#fff" }} className="w-full bg-zinc-900 z-10 text-wrap" radius="sm">{d.commentValue}</Code>
  </div>
</div>;
};

export default CommentUi;
