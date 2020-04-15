import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import { Toggle, Nav, NavItem, NavIcon, NavText, SideNav } from './StyledNav';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  FaComments,
  FaUserAlt,
  FaGift,
  FaList,
  FaClock,
  FaSignOutAlt,
  FaQuoteRight,
  FaImage,
  FaImages,
  FaCode,
  FaExclamationTriangle
} from 'react-icons/fa';
import { auth } from '../../helpers/firebase';
import { createGlobalStyle } from 'styled-components';
import { getPhrase } from '@/renderer/helpers/lang';
import {
  sideBarBackgroundColor,
  sideBarHoverColor,
  accentColor
} from '@/renderer/helpers/appearance';
import { clearDatabase } from '../../helpers/db/db';
// import styled from 'styled-components';

// tslint:disable-next-line: use-default-type-parameter
interface IProps extends RouteComponentProps<{}> {}

/**
 * @description Menu component that generate the side menu
 */
const MenuComponent = (
  props: IProps
): React.FunctionComponentElement<IProps> => {
  /**
   *
   * @description acts as the main "router" swapping hashes when clicked.
   */
  const sideNavSelect = async (selected: string): Promise<void> => {
    if (selected === '/logout') {
      await auth.signOut();
      window.location.hash = '';
      await clearDatabase();
      window.location.reload();
    } else {
      props.history.push(selected);
    }
  };

  interface IGlobalOverRide {
    background?: string;
    backgroundHighlight?: string;
    backgroundHover?: string;
    color?: string;
    colorHighlight?: string;
    textColor?: string;
  }

  /**
   * @description Over rides the default menu styles
   */
  const GlobalOverRide = createGlobalStyle`
    #menu {
      Top: 28px !important;
      background: ${(mProps: IGlobalOverRide): ThemeSet | string =>
        mProps.background
          ? mProps.background
          : sideBarBackgroundColor
          ? sideBarBackgroundColor
          : '#f1f1f1'} !important
    }
    #menu-toggle {
      background: ${(mProps: IGlobalOverRide): ThemeSet | string =>
        mProps.background
          ? mProps.background
          : sideBarBackgroundColor
          ? sideBarBackgroundColor
          : '#f1f1f1'} !important;
        & > span {
          background: ${(mProps: IGlobalOverRide): ThemeSet | string =>
            mProps.textColor
              ? mProps.textColor
              : accentColor
              ? accentColor
              : '#922ccedd'} !important
        }
        *:hover > span{
          background: ${(mProps: IGlobalOverRide): ThemeSet | string =>
            mProps.colorHighlight
              ? mProps.colorHighlight
              : sideBarHoverColor
              ? sideBarHoverColor
              : '#f1f1f1'} !important
        }
    }
  
    div[class*='sidenav-navitem--'] {
      > div {
        background-color: '#00000000' !important;
        &:hover{
          background-color: ${(mProps: IGlobalOverRide): ThemeSet | string =>
            mProps.backgroundHover
              ? mProps.backgroundHover
              : sideBarHoverColor
              ? sideBarHoverColor
              : '#f1f1f1'} !important
        }
        /**
         * This text/icon css is for when the selected view is not toggled or selected
         */
        & > div[class*='navtext--'] {
          color: ${(mProps: IGlobalOverRide): ThemeSet | string =>
            mProps.textColor
              ? mProps.textColor
              : accentColor
              ? accentColor
              : '#922ccedd'} !important
        }
        & > div[class*='navicon--'] > svg {
          color: ${(mProps: IGlobalOverRide): ThemeSet | string =>
            mProps.textColor
              ? mProps.textColor
              : accentColor
              ? accentColor
              : '#922ccedd'} !important
        }
      }
      &[class*='highlighted--'] > div {
        background-color: ${(mProps: IGlobalOverRide): ThemeSet | string =>
          mProps.backgroundHighlight
            ? mProps.backgroundHighlight
            : accentColor
            ? accentColor
            : '#922ccedd'} !important;

        /**
         * This text/icon css is for when the selected view is toggled or selected
         */
        & > div[class*='navtext--'] {
          color: ${(mProps: IGlobalOverRide): string =>
            mProps.colorHighlight
              ? mProps.colorHighlight
              : '#f1f1f1'} !important
        }
        & > div[class*='navicon--'] > svg {
          color: ${(mProps: IGlobalOverRide): string =>
            mProps.colorHighlight
              ? mProps.colorHighlight
              : '#f1f1f1'} !important
        }
      }
    }
  `;

  return (
    <React.Fragment>
      <GlobalOverRide colorHighlight={'#f1f1f1'} />
      <SideNav onSelect={sideNavSelect} id={'menu'}>
        <Toggle id={'menu-toggle'} />
        <Nav
          defaultSelected={
            props.location.pathname ? props.location.pathname : ''
          }>
          <NavItem eventKey='/' className='navItem'>
            <NavIcon>
              <FaComments
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaComments>
            </NavIcon>
            <NavText>{getPhrase('menu_chat')}</NavText>
          </NavItem>
          <NavItem eventKey='/users'>
            <NavIcon>
              <FaUserAlt
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaUserAlt>
            </NavIcon>
            <NavText>{getPhrase('menu_users')}</NavText>
          </NavItem>
          {/* <NavItem eventKey='/giveaways'>
            <NavIcon>
              <FaGift
                style={{ fontSize: '30px', width: '30px', height: '45px' }}
              ></FaGift>
            </NavIcon>
            <NavText>{getPhrase('menu_giveaways')}</NavText>
          </NavItem> */}
          <NavItem eventKey='/commands'>
            <NavIcon>
              <FaList
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaList>
            </NavIcon>
            <NavText>{getPhrase('menu_commands')}</NavText>
          </NavItem>
          <NavItem eventKey='/custom_variables'>
            <NavIcon>
              <FaCode
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaCode>
            </NavIcon>
            <NavText>{getPhrase('menu_custom_variables')}</NavText>
          </NavItem>
          
          <NavItem eventKey='/alerts'>
            <NavIcon>
              <FaExclamationTriangle
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaExclamationTriangle>
            </NavIcon>
            <NavText>{'Alerts'}</NavText>
          </NavItem>
          {/* <NavItem eventKey='/quotes'>
            <NavIcon>
              <FaQuoteRight
                style={{ fontSize: '30px', width: '30px', height: '45px' }}
              ></FaQuoteRight>
            </NavIcon>
            <NavText>{getPhrase('menu_quotes')}</NavText>
          </NavItem> */}
          <NavItem eventKey='/themes'>
            <NavIcon>
              <FaImage
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaImage>
            </NavIcon>
            <NavText>{getPhrase('menu_themes')}</NavText>
          </NavItem>
          {/* <NavItem eventKey='/testing'>
            <NavIcon>
              <FaImage
                style={{ fontSize: '30px', width: '30px', height: '45px' }}
              ></FaImage>
            </NavIcon>
            <NavText>{getPhrase('menu_themes')}</NavText>
          </NavItem> */}
          <NavItem eventKey='/logout'>
            <NavIcon>
              <FaSignOutAlt
                style={{
                  fontSize: '30px',
                  width: '30px',
                  height: '45px'
                }}></FaSignOutAlt>
            </NavIcon>
            <NavText>{getPhrase('menu_logout')}</NavText>
          </NavItem>
        </Nav>
      </SideNav>
    </React.Fragment>
  );
};

export const Menu = withRouter(MenuComponent);
