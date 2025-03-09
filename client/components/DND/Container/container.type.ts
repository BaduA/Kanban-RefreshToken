import { UniqueIdentifier } from "@dnd-kit/core";

export default interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  canAddItem: boolean;
  onAddItem?: () => void;
}
