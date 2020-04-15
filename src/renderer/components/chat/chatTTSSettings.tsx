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
} from '../generic-styled-components/PopupDialog';
import { Slider } from '../generic-styled-components/Slider';
import { SelectWrap, selectStyles,botSelectStyles } from '../generic-styled-components/Select';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/Button';
import { IConfig, ISelectOption, IOption } from '@/renderer';
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
  //const [selectedVoice,setSelectedVoice] = React.useState<number>();
  const [ttsAmplitude, setTTSAmplitude] =  React.useState<number>(config.tts_Amplitude ? config.tts_Amplitude : 86);
  const [ttsPitch, setTTSPitch] =  React.useState<number>(config.tts_Pitch ? config.tts_Pitch : 5);
  const [ttsSpeed, setTTSSpeed] =  React.useState<number>(config.tts_Speed ? config.tts_Speed : 175);
  const [ttsVoice, setTTSVoice] =  React.useState<IOption>(config.tts_Voice ? config.tts_Voice : {value: '1' , label: 'default'});
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
    setTTSVoice(config.tts_Voice ? config.tts_Voice : {value:'1',label: 'default'});
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
    return ttsAmplitude !== config.tts_Amplitude || ttsPitch !== config.tts_Pitch || ttsSpeed !== config.tts_Speed;
  };

  const sortTTSVoicesList = (): Array<IOption> => {
    console.log("Prespeak: ", ttsVoiceList);
    console.log("Postspeak: ", ttsVoiceList);
    var voiceSort:IOption[] = [];
    var i;
    for (i = 0 ;i < (ttsVoiceList.length - 1) ; i++) {
       voiceSort[i]= {value: String(i) ,label: ttsVoiceList[i].name};
      
    }
    return voiceSort;

  }

  const voicesPlz = () => {
    if (speechSynthesis.onvoiceschanged !== undefined ){
      speechSynthesis.onvoiceschanged = sortTTSVoicesList;
    }
  };

  const ttsVoiceList = [ 
    {voiceURI: "Microsoft David Desktop - English (United States)", name: "Microsoft David Desktop - English (United States)", lang: "en-US", localService: true, default: true},
    {voiceURI: "Microsoft Zira Desktop - English (United States)", name: "Microsoft Zira Desktop - English (United States)", lang: "en-US", localService: true, default: false},
    {voiceURI: "Google Deutsch", name: "Google Deutsch", lang: "de-DE", localService: false, default: false},
    {voiceURI: "Google US English", name: "Google US English", lang: "en-US", localService: false, default: false},
    {voiceURI: "Google UK English Female", name: "Google UK English Female", lang: "en-GB", localService: false, default: false},
    {voiceURI: "Google UK English Male", name: "Google UK English Male", lang: "en-GB", localService: false, default: false},
    {voiceURI: "Google español", name: "Google español", lang: "es-ES", localService: false, default: false},
    {voiceURI: "Google español de Estados Unidos", name: "Google español de Estados Unidos", lang: "es-US", localService: false, default: false},
    {voiceURI: "Google français", name: "Google français", lang: "fr-FR", localService: false, default: false},
    {voiceURI: "Google हिन्दी", name: "Google हिन्दी", lang: "hi-IN", localService: false, default: false},
    {voiceURI: "Google Bahasa Indonesia", name: "Google Bahasa Indonesia", lang: "id-ID", localService: false, default: false},
    {voiceURI: "Google italiano", name: "Google italiano", lang: "it-IT", localService: false, default: false},
    {voiceURI: "Google 日本語", name: "Google 日本語", lang: "ja-JP", localService: false, default: false},
    {voiceURI: "Google 한국의", name: "Google 한국의", lang: "ko-KR", localService: false, default: false},
    {voiceURI: "Google Nederlands", name: "Google Nederlands", lang: "nl-NL", localService: false, default: false},
    {voiceURI: "Google polski", name: "Google polski", lang: "pl-PL", localService: false, default: false},
    {voiceURI: "Google português do Brasil", name: "Google português do Brasil", lang: "pt-BR", localService: false, default: false},
    {voiceURI: "Google русский", name: "Google русский", lang: "ru-RU", localService: false, default: false},
    {voiceURI: "Google 普通话（中国大陆）", name: "Google 普通话（中国大陆）", lang: "zh-CN", localService: false, default: false},
    {voiceURI: "Google 粤語（香港）", name: "Google 粤語（香港）", lang: "zh-HK", localService: false, default: false},
    {voiceURI: "Google 國語（臺灣）", name: "Google 國語（臺灣）", lang: "zh-TW", localService: false, default: false},
    ]

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
                  header={'Voice'}
                  menuPlacement='bottom'
                  options = {sortTTSVoicesList()}
                  value={ttsVoice}
                  isMulti={false}
                  onValueChanged={(e: IOption) => {setTTSVoice(e)}}
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
                      utter.voice = ttsVoiceList[Number(ttsVoice.value)];
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
