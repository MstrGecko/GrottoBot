import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { Alert } from '@/renderer/helpers/db/db';
import { rxAlerts } from '@/renderer/helpers/rxAlerts';
import styled from 'styled-components';
import { getPhrase } from '@/renderer/helpers/lang';
import { AutoSizer, List } from 'react-virtualized';
import { ISize, IListRenderer } from '@/renderer';
import { sortBy, reverse } from 'lodash';
import { Icon } from '../generic-styled-components/Icon';
import {
  FaEdit,
  FaPlusCircle,
  FaTrashAlt,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { AddOrEditAlertPopup } from './addOrEditAlertPopup';
import { PopupDialogBackground } from '../generic-styled-components/popupDialog';
import { RemoveAlertPopup } from './RemoveAlertPopup';

import {
  listItemColor,
  listItemBorderColor,
  listItemBackgroundColor,
  listItemAlternativeColor
} from '@/renderer/helpers/appearance';
import { Tracking } from '../tracking/tracking';

const PageContentCustom = styled(PageContent)`
  padding: unset;
`;

const PageTitleCustom = styled(PageTitle)`
  overflow: hidden;
  min-height: 55px;
  & > div {
    padding-bottom: 19px;
  }
`;

const PageTitleRightCustom = styled(PageTitleRight)`
  padding-bottom: 19px;
  height: 47px;
`;

interface IAlertColumn {
  hover?: boolean;
}

const AlertsColumn = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: ${(props: IAlertColumn): string =>
    props.hover ? 'none' : 'inherit'};
  &:hover {
    cursor: ${(props: IAlertColumn): string =>
      props.hover ? 'pointer' : 'unset'};
  }
`;

interface IAlertHeader {
  background?: string;
  borderColor?: string;
}

const AlertsHeader = styled.div`
  height: 25px;
  display: flex;
  position: absolute;
  align-items: center;
  bottom: 0px;
  width: -webkit-fill-available;
  font-size: 18px;
  left: 0;
  padding-left: 10px;
  border-top: 1px solid
    ${(props: IAlertHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  border-bottom: 1px solid
    ${(props: IAlertHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  background: ${(props: IAlertHeader): ThemeSet | string =>
    props.background
      ? props.background
      : listItemAlternativeColor
      ? listItemAlternativeColor
      : '#e1e1e1'};
`;

interface IAlertRow {
  alternate: boolean;
  alternateBackground?: string;
  backgroundColor?: string;
}

const AlertRow = styled.div`
  width: calc(100% - 5px);
  height: 40px;
  display: flex;

  & > div:nth-child(1) {
    padding-left: 10px;
  }
  background: ${(props: IAlertRow): ThemeSet | string =>
    props.alternate
      ? props.alternateBackground
        ? props.alternateBackground
        : listItemAlternativeColor
        ? listItemAlternativeColor
        : '#e1e1e1'
      : props.backgroundColor
      ? props.backgroundColor
      : listItemBackgroundColor
      ? listItemBackgroundColor
      : '#f1f1f1'};
`;

/**
 * @description this is the commands page, allows for editing, creating, and deleting of new commands
 */
export const Alerts = () => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [popup, setPopup] = React.useState<React.ReactElement | null>(null);

  React.useEffect(() => {
    const listener = rxAlerts.subscribe(setAlerts);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const filteredAlerts = alerts;

  const closePopup = () => {
    setPopup(null);
  };

  const addAlertPopup = () => {
    setPopup(<AddOrEditAlertPopup closePopup={closePopup} />);
  };

  return (
    <PageMain>
      <Tracking path='/alerts' />
      <PageTitleCustom style={{ boxShadow: 'unset' }}>
        <div>{'Alerts' // ||getPhrase('alerts_name')
        }</div>
        <PageTitleRightCustom>
          <Icon>
            <FaPlusCircle
              title={'Add' //||getPhrase('alerts_add')
            }
              size='25px'
              onClick={addAlertPopup}
            ></FaPlusCircle>
          </Icon>
        </PageTitleRightCustom>
        <AlertsHeader style={{ paddingRight: '5px', paddingBottom: '0px' }}>
          <AlertsColumn style={{ maxWidth: '130px' }}>
            {'Name' //||getPhrase('alerts_column_name')
            }
          </AlertsColumn>
          <AlertsColumn style={{ maxWidth: '90px' }}>
            {'Cost' //||getPhrase('alerts_column_cost')
            }
          </AlertsColumn>
          <AlertsColumn>
            {'Text'  //||getPhrase('alerts_column_text')
            }
          </AlertsColumn>
          <AlertsColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '75px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {'Enabled'   //||getPhrase('alerts_column_toggle')
            }
          </AlertsColumn>
          <AlertsColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {'Edit'   //||getPhrase('alerts_column_edit')
            }
          </AlertsColumn>
          <AlertsColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {'Remove'   //||getPhrase('alerts_column_remove')
            }
          </AlertsColumn>
        </AlertsHeader>
      </PageTitleCustom>
      <PageContentCustom>
        <AutoSizer>
          {(size: ISize) => {
            const { width, height } = size;

            return (
              <List
                style={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px'
                }}
                width={width}
                height={height}
                rowHeight={40}
                rowCount={filteredAlerts.length}
                rowRenderer={({
                  index,
                  key,
                  style
                }: IListRenderer): React.ReactElement => {
                  /**
                   * @description takes allUsers and sorts by filter
                   *
                   * Note: if filter is displayname then it needs to toLowerCase all the names, else lowercase and uppercase will be seperated
                   */
                  const sorted = sortBy(
                    filteredAlerts,
                    (mAlert: Alert) => {
                      return mAlert.name.toLowerCase();
                    }
                  );
                  const alert = sorted[index];
                  const editAlertPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <AddOrEditAlertPopup
                        command={alert}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  const removeAlertPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <RemoveAlertPopup
                        command={alert}
                        closePopup={mClosePopup}
                      />
                    );
                  };
                  /**
                   * @description enables/disables the command in firestore which will retrigger the rx feed
                   */
                  const swapEnable = () => {
                    if (alert.enabled) {
                      alert.disable();
                    } else {
                      alert.enable();
                    }
                  };
                  return (
                    <AlertRow
                      style={{
                        ...style,
                        ...(filteredAlerts.length * 40 < height
                          ? { width: 'calc(100% - 5px)', paddingRight: '5px' }
                          : {})
                      }}
                      key={key}
                      alternate={!!(index % 2)}
                    >
                      <AlertsColumn style={{ maxWidth: '130px' }}>
                        !{alert.name}
                      </AlertsColumn>
                      <AlertsColumn style={{ maxWidth: '90px' }}>
                        {alert.cost}
                      </AlertsColumn>
                      <AlertsColumn>{alert.reply}</AlertsColumn>
                      <AlertsColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '75px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {alert.enabled ? (
                          <Icon>
                            <FaToggleOn onClick={swapEnable} size='25px' />
                          </Icon>
                        ) : (
                          <Icon>
                            <FaToggleOff onClick={swapEnable} size='25px' />
                          </Icon>
                        )}
                      </AlertsColumn>
                      <AlertsColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaEdit
                            size='20px'
                            onClick={editAlertPopup}
                          ></FaEdit>
                        </Icon>
                      </AlertsColumn>
                      <AlertsColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaTrashAlt
                            size='20px'
                            onClick={removeAlertPopup}
                          ></FaTrashAlt>
                        </Icon>
                      </AlertsColumn>
                    </AlertRow>
                  );
                }}
              />
            );
          }}
        </AutoSizer>
      </PageContentCustom>
      {popup ? <PopupDialogBackground>{popup}</PopupDialogBackground> : null}
    </PageMain>
  );
};
