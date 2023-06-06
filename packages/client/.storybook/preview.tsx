import type { Preview } from "@storybook/react";
import { unstable_createRemixStub } from '@remix-run/testing';
import '../public/build/_assets/tailwind-6P27NRL3.css';


const preview: Preview = {
  decorators: [
    Story => {
      const RemixStub = unstable_createRemixStub([
        {
          path: '/*',
          element: <Story />,
        },
      ]);

      return <div><RemixStub initialEntries={ ['/']} /></div>;
    },
  ],
};

export default preview;