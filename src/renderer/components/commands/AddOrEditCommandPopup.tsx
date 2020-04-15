import * as React from 'react';
import { User, Command } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInput,
  PopupDialogInputInfo,
  PopupDialogPadding,
  PopupButtonWrapper
} from '../generic-styled-components/PopupDialog';
import { SelectWrap, selectStyles } from '../generic-styled-components/Select';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
import { rxCommands } from '@/renderer/helpers/rxCommands';
import Select from 'react-select';
import { ISelectOption } from '@/renderer';
import { sendEvent } from '@/renderer/helpers/reactGA';

interface IProps {
  closePopup: Function;
  command?: Command;
}

/**
 * @descritpion Edit user popup or Add user popup
 */
export const AddOrEditCommandPopup = (props: IProps) => {
  const [commandName, setCommandName] = React.useState(
    props.command ? props.command.name : ''
  );
  const [commandReply, setCommandReply] = React.useState(
    props.command ? props.command.reply : ''
  );
  const [commandCost, setCommandCost] = React.useState(
    props.command ? props.command.cost : 0
  );
  const [commandPermissions, setCommandPermissions] = React.useState(
    props.command ? props.command.permissions : []
  );

  const [commands, setCommands] = React.useState<{ [id: string]: Command }>({});

  /**
   * @description load all current commands and then store them in a map to check to see if the edit/added one already exists to throw error
   */
  React.useEffect(() => {
    const listener = rxCommands.subscribe((mCommands: Command[]) => {
      setCommands(
        mCommands.reduce((acc: { [id: string]: Command }, command: Command) => {
          acc[command.name.toLowerCase()] = command;

          return acc;
        }, {})
      );
    });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  /**
   * @description handles the creation of a new command, saves it, then closes the popup
   */
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newCommand = new Command(
      commandName,
      commandName,
      commandPermissions,
      commandReply,
      commandCost
    );
    newCommand.save();
    sendEvent('Commands', 'new').catch(null);
    props.closePopup();
  };

  /**
   * @description handles the edit of a command, saves, then closes the popup
   */
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const command = props.command;
    if (!command) {
      return;
    }
    if (
      commandName === command.name &&
      commandReply === command.reply &&
      commandCost === command.cost &&
      commandPermissions === command.permissions
    ) {
      return;
    }
    if (command.name !== commandName) {
      command.delete();
    }
    const newCommand = new Command(
      commandName,
      commandName,
      commandPermissions,
      commandReply,
      commandCost
    );
    newCommand.save();
    sendEvent('Commands', 'edit').catch(null);
    props.closePopup();
  };

  /**
   * @description checks if the user can hit the submit button or not
   * changes based if the user is in edit or add mode
   */
  const canSubmit = () => {
    if (props.command) {
      const command = props.command;
      if (!command) {
        return false;
      }
      if (
        commandName === command.name &&
        commandReply === command.reply &&
        commandCost === command.cost &&
        commandPermissions === command.permissions
      ) {
        return false;
      }
    }

    return commandReply.length > 0 && commandName.length > 0;
  };

  const updateCommandName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandName(e.target.value.replace(' ', '-'));
  };

  const updateCommandReply = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandReply(e.target.value);
  };

  const updateCommandCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandCost(parseInt(e.target.value, undefined));
  };

  const updateCommandPermissions = (
    value: ISelectOption<0 | 1 | 2 | 3 | 4>[]
  ) => {
    setCommandPermissions(value);
  };

  return (
    <PopupDialog
      style={{
        height: 'min-content',
        minHeight: 'min-content',
        width: '425px',
        minWidth: '425px'
      }}
    >
      <PopupDialogExitIcon>
        <FaTimes onClick={close}></FaTimes>
      </PopupDialogExitIcon>
      <PopupDialogTitle>
        {props.command
          ? `${getPhrase('edit_command_name')}, ${props.command.name}`
          : getPhrase('new_command_name')}
      </PopupDialogTitle>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_command_info_title')}
        </PopupDialogInputName>
        <SelectWrap width={'100%'}>
          <Select
            styles={selectStyles}
            value={commandPermissions}
            isMulti={true}
            onChange={updateCommandPermissions}
            options={[
              { label: 'Viewer', value: 0 },
              { label: 'Loyal Viewer', value: 1 },
              { label: 'Subscriber', value: 2 },
              { label: 'Moderator', value: 3 },
              { label: 'Owner / Bot', value: 4 }
            ]}
          />
        </SelectWrap>
        <PopupDialogInputInfo>
          {getPhrase('new_command_permissions_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_command_name_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={commandName}
          onChange={updateCommandName}
          maxLength={16}
        />
        <PopupDialogInputInfo
          error={
            commandName.startsWith('!') ||
            (!!commands[commandName.toLowerCase()] &&
              (!!props.command
                ? props.command.name.toLowerCase() !== commandName.toLowerCase()
                : true))
          }
        >
          {!!commands[commandName.toLowerCase()] &&
          (!!props.command
            ? props.command.name.toLowerCase() !== commandName.toLowerCase()
            : true)
            ? getPhrase('new_command_name_error_exists')
            : getPhrase('new_command_name_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_command_reply_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={commandReply}
          onChange={updateCommandReply}
          maxLength={140}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_command_reply_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupDialogInputWrapper>
        <PopupDialogInputName>
          {getPhrase('new_command_cost_title')}
        </PopupDialogInputName>
        <PopupDialogInput
          value={commandCost}
          onChange={updateCommandCost}
          type='number'
          min={0}
        />
        <PopupDialogInputInfo>
          {getPhrase('new_command_cost_info')}
        </PopupDialogInputInfo>
      </PopupDialogInputWrapper>
      <PopupButtonWrapper>
        <Button
          disabled={!canSubmit()}
          onClick={
            canSubmit()
              ? props.command
                ? handleEdit
                : handleCreate
              : () => null
          }
        >
          {props.command
            ? getPhrase('edit_command_submit')
            : getPhrase('new_command_submit')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
