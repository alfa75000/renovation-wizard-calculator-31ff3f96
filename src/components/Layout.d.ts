
import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  currentProjectName?: string; // Add this new prop
}
