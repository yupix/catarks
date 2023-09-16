import { IconCopy } from "@tabler/icons"
import toast from "react-hot-toast"

type IProps = {
    targetValue: string
}

export function CopyButton ({targetValue}: IProps) {
    function copyItemName (name: string) {
        navigator.clipboard.writeText(name)
        toast.success('アイテム名をコピーしました') 
      }

    return (
        <button className="btn btn-xs btn-ghost" onClick={() => copyItemName(targetValue)}><IconCopy /></button>
    )
}