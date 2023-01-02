import type { PaginationStylesParams } from "@mantine/core";
import { Flex, createStyles, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import type { FC } from "react";
import { For } from "./for";
import { Link } from "@remix-run/react";
import { VentLink } from "./link";

const sizes = {
  xs: 22,
  sm: 26,
  md: 32,
  lg: 38,
  xl: 44,
};


const useStyles = createStyles((theme, { size, radius, color }: PaginationStylesParams) => {
  const colors = theme.fn.variant({ color, variant: 'filled' });

  return {
    item: {
      ...theme.fn.fontStyles(),
      ...theme.fn.focusStyles(),
      cursor: 'pointer',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
        }`,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size, sizes }),
      minWidth: theme.fn.size({ size, sizes }),
      padding: `0 ${theme.fn.size({ size, sizes: theme.spacing }) / 2}px`,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      borderRadius: theme.fn.radius(radius),
      lineHeight: 1,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,

      '&:active:not(:disabled):not([data-dots])': theme.activeStyles,

      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
      },

      '&[data-dots]': {
        cursor: 'default',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
      },

      '&[data-active]': {
        borderColor: 'transparent',
        color: colors.color,
        backgroundColor: colors.background,
      },
    },
  };
});

export const Pagination: FC<{ max: number, currentPage: number, to: string }> = ({ currentPage, max, to }) => {
  const theme = useMantineTheme();
  const { classes } = useStyles({ radius: 'md', size: 'md', 'color': 'blue' })
  const nextDisable = 1 === currentPage
  const prevDisable = max <= currentPage
  return (
    <Flex gap={6}>
      <VentLink options={{ to: `${to}${currentPage - 1}`, disabled: nextDisable }}>
        <button type="button" className={classes.item} disabled={nextDisable}><IconChevronLeft /></button>
      </VentLink>
      <For v={[1, (i) => i <= max, (i) => i + 1]}>
        {(i, index) => (
          <Link to={`${to}${i}`} key={i}>
            <button type="button" className={classes.item} data-active={currentPage === i || undefined}>{i}</button>
          </Link>
        )}
      </For>
      <VentLink options={{ to: `${to}${currentPage + 1}`, disabled: prevDisable, prefetch: "intent" }}>
        <button type="button" className={classes.item} disabled={prevDisable}><IconChevronRight /></button>
      </VentLink>
    </Flex>
  )
}