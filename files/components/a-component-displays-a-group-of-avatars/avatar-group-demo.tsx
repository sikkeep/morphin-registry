import { AvatarGroup } from "./avatar-group";

const Demo = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <AvatarGroup
        avatars={[
          {
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            label: "Alex",
          },
          {
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
            label: "Sarah",
          },
          {
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            label: "Mike",
          },
          {
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            label: "Emma",
          },
          {
            src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            label: "David",
          },
          {
            src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
            label: "Olivia",
          },
        ]}
        maxVisible={4}
        size={45}
      />
    </div>
  );
};

export { Demo };
