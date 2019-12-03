import * as React from 'react';
import {
  PopupDialogBackground,
  PopupDialog,
  PopupDialogExitIcon,
  PopupDialogTitle,
  PopupDialogText,
  PopupButtonWrapper,
  PopupDialogInputWrapper,
  PopupDialogInputInfo,
  PopupDialogInputName,
  PopupDialogTabWrapper,
  PopupDialogTabHeaderWrapper,
  PopupDialogTab,
  PopupDialogTabPage,
  PopupDialogInput
} from '../generic-styled-components/popupDialog';
import { Slider } from '../generic-styled-components/Slider';
import { SelectWrap, selectStyles,botSelectStyles } from '../generic-styled-components/Select';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { IConfig, ISelectOption } from '@/renderer';
import Select from 'react-select';
import { updateConfig } from '@/renderer/helpers/rxConfig';
import Toggle from 'react-toggle';
import { indicatorSeparatorCSS } from 'react-select/src/components/indicators';

/**
 * @description the popup for managing dlive accounts
 */
export const ChatTTSSettings = ({
  config,
  closeTTSControl
}: {
  config: Partial<IConfig>;
  closeTTSControl(): void;
}) => {

  const [tab, setTab] = React.useState('donations');
  //const [selectedVoice,setSelectedVoice] = React.useState<IOption>();
  const [ttsAmplitude, setTTSAmplitude] =  React.useState<number>(config.tts_Amplitude ? config.tts_Amplitude : 86);
  const [ttsPitch, setTTSPitch] =  React.useState<number>(config.tts_Pitch ? config.tts_Pitch : 5);
  const [ttsSpeed, setTTSSpeed] =  React.useState<number>(config.tts_Speed ? config.tts_Speed : 175);
  const [ttsVoice, setTTSVoice] =  React.useState<number>(config.tts_Voice ? config.tts_Voice : 1);
  const [hasTTSDonations, setHasTTSDonations] = React.useState<boolean>(
    !!config.hasTTSDonations
  );
  const [hasTTSDonationMessages, setHasTTSDonationMessages] = React.useState<
    boolean
  >(!!config.hasTTSDonationMessages);
  const [allowedTTSDonations, setAllowedTTSDonations] = React.useState<
    ISelectOption<'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'>[]
  >(config.allowedTTSDonations ? config.allowedTTSDonations : []);


  React.useEffect(() => {
    setHasTTSDonations(!!config.hasTTSDonations);
    setTTSAmplitude(config.tts_Amplitude ? config.tts_Amplitude : 86);
    setTTSPitch(config.tts_Pitch ? config.tts_Pitch : 5);
    setTTSSpeed(config.tts_Speed ? config.tts_Speed : 175);
    setTTSVoice(config.tts_Voice ?config.tts_Voice : 1);
    setAllowedTTSDonations(
      config.allowedTTSDonations ? config.allowedTTSDonations : []
    );
  }, [config]);

  const isPage = (type: string): boolean => tab === type;

  const goToDonations = () => {
    setTab('donations');
  };

  const goToOther = () => {
    setTab('tts_tweaks');
  }

  const updateAllowedTTSDonations = (
    e: ISelectOption<
      'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'
    >[]
  ) => {
    updateConfig({ ...config, allowedTTSDonations: e }).catch(null);
  };

  const updateHasTTSDonations = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...config, hasTTSDonations: !config.hasTTSDonations }).catch(
      null
    );
  };

  const updateHasTTSDonationMessages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateConfig({
      ...config,
      hasTTSDonationMessages: !config.hasTTSDonationMessages
    }).catch(console.error);
  };

  const updateTTSTweaks = () => {
    updateConfig({
      ...config,
      tts_Amplitude: ttsAmplitude,
      tts_Pitch: ttsPitch,
      tts_Speed: ttsSpeed,
      tts_Voice: ttsVoice
    }).catch(null);
  }

  const ttsTweakshasChanged = (): boolean => {
    return ttsAmplitude !== config?.tts_Amplitude || ttsPitch !== config?.tts_Pitch || ttsSpeed !== config?.tts_Speed;
  };

  const getTTSVoicesList = (): Array<object> => {
    var stupid = new SpeechSynthesis;// this is bad, and will probably cause a memory leak :/
    var idiot = stupid.getVoices();
    var Array voiceSort = [];
    var Number i;
    for (i = 0 ;i < (idiot.length - 1; i++) {
       voiceSort[i]= {value: i ,display: idiot[i].name};
      
    }
    return voiceSort;

  }

  return (
    <PopupDialogBackground>
      <PopupDialog
        style={{
          height: 'min-content',
          minHeight: 'min-content',
          width: '425px',
          minWidth: '425px'
        }}
      >
        <PopupDialogExitIcon>
          <FaTimes onClick={closeTTSControl}></FaTimes>
        </PopupDialogExitIcon>
        <PopupDialogTitle>{getPhrase('chat_tts_title')}</PopupDialogTitle>
        <PopupDialogInputWrapper>
          <PopupDialogInputName>
            {getPhrase('chat_tts_enable')}
          </PopupDialogInputName>
          <Toggle
            checked={hasTTSDonations}
            icons={false}
            onChange={updateHasTTSDonations}
            className={'toggler'}
          />
          <PopupDialogInputInfo>
            {getPhrase('chat_tts_enable_info')}
          </PopupDialogInputInfo>
        </PopupDialogInputWrapper>
          <PopupDialogTabWrapper>
          <PopupDialogTabHeaderWrapper>
            <PopupDialogTab 
              onClick={isPage('donations') ? () => null : goToDonations}
              selected={isPage('donations')}
            >
              {getPhrase('tts_tab_donations')}
            </PopupDialogTab>
            <PopupDialogTab
              onClick={isPage('tts_tweaks') ? () => null : goToOther}
              selected={isPage('tts_tweaks')}
            >
              {getPhrase('tts_tab_ttstweaks')}
            </PopupDialogTab>
          </PopupDialogTabHeaderWrapper>
        </PopupDialogTabWrapper>
        <PopupDialogTabPage>
            {isPage('donations') ? (
              <React.Fragment>
                <PopupDialogInputWrapper>
                  <PopupDialogInputName>
                    {getPhrase('chat_tts_message')}
                  </PopupDialogInputName>
                  <Toggle
                    checked={hasTTSDonationMessages}
                    icons={false}
                    onChange={updateHasTTSDonationMessages}
                    className={'toggler'}
                  />
                  <PopupDialogInputInfo>
                    {getPhrase('chat_tts_message_info')}
                  </PopupDialogInputInfo>
                </PopupDialogInputWrapper>
                <PopupDialogInputWrapper>
                  <PopupDialogInputName>
                    {getPhrase('chat_tts_options')}
                  </PopupDialogInputName>
                  <SelectWrap width={'100%'}>
                    <Select
                      styles={selectStyles}
                      value={allowedTTSDonations}
                      isMulti={true}
                      onChange={updateAllowedTTSDonations}
                      menuPortalTarget={document.body}
                      options={[
                        { label: 'Lemon', value: 'LEMON' },
                        { label: 'Ice Cream', value: 'ICE_CREAM' },
                        { label: 'Diamond', value: 'DIAMOND' },
                         { label: 'Ninjaghini', value: 'NINJAGHINI' },
                        { label: 'Ninjet', value: 'NINJET' }
                      ]}
                      isDisabled={!hasTTSDonations}
                    />
                  </SelectWrap>
                  <PopupDialogInputInfo>
                    {getPhrase('chat_tts_options_info')}
                  </PopupDialogInputInfo>
                </PopupDialogInputWrapper>
              </React.Fragment>
            ) : isPage('tts_tweaks') ? (
              <React.Fragment>
                <SelectWrap paddingLeft={'20px'}>
                  <Select
                  menuPlacement='bottom'
                  options = {getTTSVoicesList()}
                  value={ttsVoice}
                  isMulti={false}
                  onValueChanged={(e: number) => {setTTSVoice(e)};}
                  styles={botSelectStyles}

                  />

                </SelectWrap>
                <PopupDialogInputWrapper>
                  <Slider header={getPhrase('tts_slider_volume')} value={ttsAmplitude} minValue={0} maxValue={200} onValueChanged={(e: number) => {
                    setTTSAmplitude(e);
                  }}/>
                </PopupDialogInputWrapper>
                <PopupDialogInputWrapper>
                  <Slider header={getPhrase('tts_slider_pitch')} value={ttsPitch} minValue={0} maxValue={200} onValueChanged={(e: number) => {
                    setTTSPitch(e);
                  }}/>
                </PopupDialogInputWrapper>
                <PopupDialogInputWrapper>
                  <Slider header={getPhrase('tts_slider_speed')} value={ttsSpeed} minValue={0} maxValue={300} onValueChanged={(e: number) => {
                    setTTSSpeed(e);
                  }}/>
                </PopupDialogInputWrapper>
                <PopupButtonWrapper>
                  <Button        
                    style={{ zIndex: 4, position: 'static', marginTop: '10px' }}
                    onClick={() => {
                      var utter = new SpeechSynthesisUtterance();
                      utter.text = 'I scream, you scream, we all scream for ice cream';
                      utter.volume = ttsAmplitude / 100;
                      utter.pitch = ttsPitch / 100;
                      utter.rate = ttsSpeed / 100;
                      //utter.voice = ttsVoice;
                      utter.onend = () => {};
                      speechSynthesis.speak(utter);
                    }}
                    inverted
                  >
                    {getPhrase('tts_btn_testtts')}
                  </Button>
                  <Button   
                    disabled={!ttsTweakshasChanged()}     
                    style={{ zIndex: 4, position: 'static', marginTop: '10px' }}
                    onClick={ttsTweakshasChanged() ? updateTTSTweaks : () => null}
                  >
                    {getPhrase('tts_btn_saveconfig')}
                  </Button>
                </PopupButtonWrapper>
              </React.Fragment>
            ) : null}
          </PopupDialogTabPage>
      </PopupDialog>
    </PopupDialogBackground>
  );
};
