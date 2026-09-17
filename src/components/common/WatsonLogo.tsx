import React from 'react';
import { SysTestLogo } from './SysTestLogo';

interface WatsonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const WatsonLogo: React.FC<WatsonLogoProps> = (props) => {
  return <SysTestLogo {...props} showSubtitle={props.showSubtitle ?? true} />;
};

