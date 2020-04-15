import * as React from 'react';
import styled from 'styled-components';
import { ThemeSet } from 'styled-theming';
import { 
  accentColor, 
  accentHoverColor 
} from '@/renderer/helpers/appearance';

interface IProps {
  disabled?: boolean;
  color?: ThemeSet | string;
  colorHover?: ThemeSet | string;
}

/**
 * @description wraps icon buttons
 */
export const Icon = styled.div`
  height: min-content;
  width: min-content;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    color: ${(props: IProps): ThemeSet | string =>
      props.disabled
        ? '#e1e1e1'
        : props.color
        ? `${props.color}dd`
        : accentColor ? accentColor : '#922ccedd'};
  }
  &:hover {
    cursor: ${(props: IProps): string =>
      props.disabled ? 'unset' : 'pointer'};
    & > svg {
      color: ${(props: IProps): ThemeSet | string =>
        props.disabled
          ? '#e1e1e1'
          : props.colorHover
          ? props.colorHover
          : props.color
          ? props.color
          : accentColor ? accentColor : '#922ccedd'};
    }
  }
`;
