import {
  MessageSquareTextIcon,
  PencilIcon,
  SmileIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add Reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in Thread">
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit Message">
              <Button variant="ghost" size="iconSm" disabled={isPending}>
                <PencilIcon className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete Message">
              <Button variant="ghost" size="iconSm" disabled={isPending}>
                <TrashIcon className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
