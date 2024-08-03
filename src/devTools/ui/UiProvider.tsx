import { ReactNode } from 'react';

type UiProviderProps = {
  children: ReactNode;
};
export function UiProvider({ children }: UiProviderProps) {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet"
      />
      <div style={uiProviderStyles}>{children}</div>
    </div>
  );
}

const uiProviderStyles = {
  fontFamily: 'Open Sans, sans-serif',
};
