export const ERRORS = new Map<
  string,
  {
    description: string;
    code: string;
  }
>([
  [
    '639ebe9f-b8be-435c-a350-5802e1ad2687',
    {
      description: '既にDiscordと連携済みです',
      code: 'ALREADY_CONNECTED_TO_DISCORD',
    },
  ],
]);
