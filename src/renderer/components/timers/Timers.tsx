import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import {
  PageMain,
  PageTitle,
  PageContent,
  PageTitleRight
} from '../generic-styled-components/Page';
import { Timer } from '@/renderer/helpers/db/db';
import { rxTimers } from '@/renderer/helpers/rxTimers';
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
import { AddOrEditTimerPopup } from './AddOrEditTimerPopup';
import { PopupDialogBackground } from '../generic-styled-components/PopupDialog';
import { RemoveTimerPopup } from './RemoveTimerPopup';

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

interface ITimerColumn {
  hover?: boolean;
}

const TimersColumn = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: ${(props: ITimerColumn): string =>
    props.hover ? 'none' : 'inherit'};
  &:hover {
    cursor: ${(props: ITimerColumn): string =>
      props.hover ? 'pointer' : 'unset'};
  }
`;

interface ITimerHeader {
  background?: string;
  borderColor?: string;
}

const TimersHeader = styled.div`
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
    ${(props: ITimerHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  border-bottom: 1px solid
    ${(props: ITimerHeader): ThemeSet | string =>
      props.borderColor
        ? props.borderColor
        : listItemBorderColor
        ? listItemBorderColor
        : '#d1d1d1'};
  background: ${(props: ITimerHeader): ThemeSet | string =>
    props.background
      ? props.background
      : listItemAlternativeColor
      ? listItemAlternativeColor
      : '#e1e1e1'};
`;

interface ITimerRow {
  alternate: boolean;
  alternateBackground?: string;
  backgroundColor?: string;
}

const TimerRow = styled.div`
  width: calc(100% - 5px);
  height: 40px;
  display: flex;
  align-items: center;
  & > div:nth-child(1) {
    padding-left: 10px;
  }
  background: ${(props: ITimerRow): ThemeSet | string =>
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
 * @description this is the Timers page, allows for editing, creating, and deleting of new Timers
 */
export const Timers = () => {
  const [Timers, setTimers] = React.useState<Timer[]>([]);
  const [popup, setPopup] = React.useState<React.ReactElement | null>(null);

  React.useEffect(() => {
    const listener = rxTimers.subscribe(setTimers);

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const filteredTimers = Timers;

  const closePopup = () => {
    setPopup(null);
  };

  const addTimerPopup = () => {
    setPopup(<AddOrEditTimerPopup closePopup={closePopup} />);
  };

  return (
    <PageMain>
      <Tracking path='/timers' />
      <PageTitleCustom style={{ boxShadow: 'unset' }}>
        <div>{getPhrase('timers_name')}</div>
        <PageTitleRightCustom>
          <Icon>
            <FaPlusCircle
              title={getPhrase('timers_add')}
              size='25px'
              onClick={addTimerPopup}
            ></FaPlusCircle>
          </Icon>
        </PageTitleRightCustom>
        <TimersHeader style={{ paddingRight: '5px', paddingBottom: '0px' }}>
          <TimersColumn style={{ maxWidth: '130px', minWidth: '130px' }}>
            {getPhrase('timers_column_name')}
          </TimersColumn>
          <TimersColumn style={{ maxWidth: '90px', minWidth: '90px' }}>
            {getPhrase('timers_column_seconds')}
          </TimersColumn>
          <TimersColumn style={{ maxWidth: '110px', minWidth: '110px' }}>
            {getPhrase('timers_column_minmsgs')}
          </TimersColumn>
          <TimersColumn>{getPhrase('timers_column_response')}</TimersColumn>
          <TimersColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '75px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('timers_column_toggle')}
          </TimersColumn>
          <TimersColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('timers_column_edit')}
          </TimersColumn>
          <TimersColumn
            style={{
              maxWidth: 'min-content',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {getPhrase('timers_column_remove')}
          </TimersColumn>
        </TimersHeader>
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
                rowCount={filteredTimers.length}
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
                  const sorted = sortBy(filteredTimers, (mTimer: Timer) => {
                    return mTimer.name.toLowerCase();
                  });
                  const timer = sorted[index];
                  const editTimerPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <AddOrEditTimerPopup
                        timer={timer}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  const removeTimerPopup = () => {
                    const mClosePopup = () => {
                      setPopup(null);
                    };
                    setPopup(
                      <RemoveTimerPopup
                        timer={timer}
                        closePopup={mClosePopup}
                      />
                    );
                  };

                  const swapEnable = () => {
                    if (timer.enabled) {
                      timer.disable();
                    } else {
                      timer.enable();
                    }
                  };

                  return (
                    <TimerRow
                      style={{
                        ...style,
                        ...(filteredTimers.length * 40 < height
                          ? { width: 'calc(100% - 5px)', paddingRight: '5px' }
                          : {})
                      }}
                      key={key}
                      alternate={!!(index % 2)}
                    >
                      <TimersColumn
                        style={{ maxWidth: '130px', minWidth: '130px' }}
                      >
                        {timer.name}
                      </TimersColumn>
                      <TimersColumn
                        style={{ maxWidth: '90px', minWidth: '90px' }}
                      >
                        {timer.seconds}
                      </TimersColumn>
                      <TimersColumn
                        style={{ maxWidth: '110px', minWidth: '110px' }}
                      >
                        {timer.messages}
                      </TimersColumn>
                      <TimersColumn
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {timer.reply}
                      </TimersColumn>
                      <TimersColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '75px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        {timer.enabled ? (
                          <Icon>
                            <FaToggleOn onClick={swapEnable} size='25px' />
                          </Icon>
                        ) : (
                          <Icon>
                            <FaToggleOff onClick={swapEnable} size='25px' />
                          </Icon>
                        )}
                      </TimersColumn>
                      <TimersColumn
                        style={{
                          maxWidth: 'min-content',
                          minWidth: '50px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon>
                          <FaEdit size='20px' onClick={editTimerPopup}></FaEdit>
                        </Icon>
                      </TimersColumn>
                      <TimersColumn
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
                            onClick={removeTimerPopup}
                          ></FaTrashAlt>
                        </Icon>
                      </TimersColumn>
                    </TimerRow>
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
