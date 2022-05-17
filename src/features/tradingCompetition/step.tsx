import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flex, Button, message } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import copy from "copy-to-clipboard";
import { useAppSelector } from "../../store/hook";
import { downloadImage } from "../../utils/tools";

const Step = styled(Flex)`
  flex-direction: column;
  margin: auto;
  margin-top: -2px;
  background: #1B0E3A;
  width: 375px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 960px;
    background: #0b0814;
  }
`

const B = styled(Flex)<{bg?;h?;}>`
  background: #1B0E3A;
  width: 375px;
  margin: auto;
  flex-direction: column;
  padding-top: 18px;
  padding-bottom: 56px;
  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({bg}) => bg || `url('/images/tradingCompetition/BG1.png')`};
    height: ${({h }) => h};
    background-size: ${({bgs}) => bgs || 'cover'};
    background-repeat: no-repeat;
    // background: #0b0814;
    padding-top: 62px;
    width: 960px;
    margin-top: 12px;
    &:nth-child(1){
      margin-top: 0;
    }
  }
`

const Dis = styled.div<{ d? }>`
  display: ${({ d }) => (d ? "none" : "block")};
  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ d }) => (d ? "block" : "none")};
    height: 100%;
  }
`;

const BB = styled(Flex)`
  background: url('/images/tradingCompetition/BG2.png');
  background-size: 375px 606px;
  width: 375px;
  height: 606px;
  margin: auto;
  flex-direction: column;
  padding-top: 18px;
  margin-bottom: 12px;
  padding-bottom: 56px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 62px;
    width: 960px;
    height: 606px;
    background-size:  960px 606px;
  }
`

const StepT = styled.div`
  height: 27px;
  margin: 0 auto;
  position: relative;
  padding: 0 30px;
  max-width: 327px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 60px;
    height: 48px;
    max-width: 727px;
  }
  span.t{
    display: block;
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #EE1C63;
    // line-height: 33px;
    margin: auto;
    margin-top: -5px;
    z-index: 1;
    position: inherit;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: -10px;
      line-height: 36px;
      font-size: 34px;
    }
  }
  span.l{
    background: url('/images/tradingCompetition/R.png') no-repeat;
    background-size: contain;
    width: 107px;
    height: 20px;
    transform: rotateY(180deg);
    position: absolute;
    left: 0;
    top: 16px;
    z-index: 0;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 190px;
      height: 36px;
    }
  }
  span.r{
    background: url('/images/tradingCompetition/R.png') no-repeat;
    background-size: contain;
    width: 107px;
    height: 20px;
    position: absolute;
    right: 0;
    top: 16px;
    z-index: 0;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 190px;
      height: 36px;
    }
  }
`

const Content = styled(Flex)`
  margin-top: 56px;
  height: 100%;
  align-items: flex-start;
  padding-left: 24px;
  padding-right: 24px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-left: 130px;
    padding-right: 140px;
    flex-direction: row;
  }
`

const ContentL = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-right: 82px;
  span.t{
    font-size: 22px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 21px;
    margin-top: 40px;
    &:nth-child(1){
      margin-top: 0;
    }
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: inline-block;
    }
  }
  span.line{
    width: 23px;
    height: 4px;
    background: #DBDBDB;
    display: inline-block;
    margin: 26px 0;
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: inline-block;
    }
  }
  span.s{
    font-size: 16px;
    font-weight: 500;
    color: #BFBFBF;
    line-height: 21px;
  }
`

const ContentR = styled.div`
  margin-top: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
  img.poster{
    width: 327px;
    height: 171px;
    margin: 12px 0;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 288px;
      height: 151px;
    }
  }
`

const ImgC = styled.div`
  width: 327px;
  height: 171px;
  margin: 12px 0;
  position: relative;
`

const Tip = styled.div`
  height: 34px;
  background: rgba(100, 58, 255, 0.88);
  border-radius: 0px 0px 0px 8px;
  padding: 0 12px;
  position: absolute;
  right: 0;
  top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 34px;
  display: flex;
  align-items: center;
  img.tips_icon{
    margin-right: 4px;
  }
`

const InviteCode = styled.div`
  width: 327px;
  background: rgba(100, 58, 255, 0.1);
  border-radius: 4px;
  border: 1px solid RGBA(33, 18, 79, 1);
  font-size: 12px;
  font-weight: 500;
  color: #FFD153;
  line-height: 20px;
  padding: 8px 16px;
  margin-top: 24px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 288px;
  }
`

const TabH = styled(Flex)`
  width: 327px;
  height: 34px;
  margin-bottom: ${({mb}) => mb};
  span{
    background: ${({bg}) => bg};
    height: 34px;
    flex: 1;
    margin-right: ${({mr}) => mr};
    font-size: 14px;
    font-weight: 600;
    color: ${({mr}) => mr ? 'rgba(202, 202, 202, 1)' : 'rgba(255, 255, 255, 1)'};
    line-height: 34px;
    text-align: center;
    &:nth-child(2) {
      margin-right: 0;
    }
  }
`

const Img = styled.img`
  width: 375px;
  min-width: 375px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 960px;
  }
`

const A = styled.a`
  display: block;
  width: 100%;
  height: 48px;
  background: #6024FD;
  box-shadow: 0px 2px 12px 0px rgba(100, 58, 255, 0.4);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #00FFEA;
  line-height: 48px;
  text-align: center;
  margin-top; 12px;
`

const Btn = styled(Button)`
  color: #00FFEA;
  font-size: 16px;
`

const step = props => {
  const { t } = useTranslation();
  const [Url, setUrl] = useState(`${t('tradingCompetition10')} www.ccfox.com/xxx`)
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const downloadImg = useRef(null)
  useEffect(() => {
    if (userHabit?.locale === 'zh_CN') {
      setUrl(`${t('tradingCompetition10')} https://www.ccfoxzh.cc/${userHabit?.locale}/activities/2022-April-Crypto-Battle`)
    } else {
      setUrl(`${t('tradingCompetition10')} https://www.ccfox.com/${userHabit?.locale}/activities/2022-April-Crypto-Battle`)
    }
  }, [userHabit?.locale])
  
  const copyUrl = () => {
    copy(Url);
    message.success(t(t('CopySuccess')))
  }
  useEffect(() => {
    console.log('first', userHabit)
  }, [])

  const renderImg = () => {
    return `/images/tradingCompetition/${userHabit.locale}/Contract Trading Competition.jpg`
  }

  const downloadI = () => {
    // downloadImage(renderImg(), 'Contract Trading Competition.png')
    downloadImg.current.click();
  }


  
  return <Step>
    <B h='588px' bgs='960px 588px'>
      <StepT>
        <span className="l"></span>
        <span className="r"></span>
        <span className="t">{t('tradingCompetition7')}</span>
      </StepT>
      <Content>
        <ContentL>
          <span className="t">STEP 01</span>
          <span className="line"></span>
          <span className="s">{t('tradingCompetition9')}</span>
          <span className="t">STEP 02</span>
          <span className="line"></span>
          <span className="s">{t('tradingCompetition11')}</span>
        </ContentL>
        <ContentR>
          <Dis d={0}>
            <ImgC>
              <img className="poster" src={renderImg()} alt="" />
              <Tip>
                <img className='tips_icon' src="/images/tradingCompetition/TipsIcon.png" width='18px' height='18px' alt="" />
                {t('tradingCompetition40')}
              </Tip>
            </ImgC>
          </Dis>
          
          {/* <A href={renderImg()} title='asdasd' download>{t('tradingCompetition12')}</A> */}
          <Dis d={1}>
            <img className="poster" src={renderImg()} alt="" />
            <Btn variant={"primary"} width={"100%"} onClick={downloadI}>
                {t('tradingCompetition12')}
            </Btn>
          </Dis>
          <InviteCode>{Url}</InviteCode>
          <Btn variant={"primary"} color='#00FFEA' mt={"8px"} width={"100%"} onClick={copyUrl}>
              {t('tradingCompetition13')}
          </Btn>
          <a ref={downloadImg} href={renderImg()} download={'Contract Trading Competition'}></a>
          
        </ContentR>
      </Content>
    </B>
    <Dis d={0} mt='24px'>
      <Img src="/images/tradingCompetition/BS.png" alt="" />
    </Dis>
    <B>
      <StepT>
        <span className="l"></span>
        <span className="r"></span>
        <span className="t">{t('tradingCompetition8')}</span>
      </StepT>
      <Content>
        <ContentL>
          <span className="t">{t('tradingCompetition15')}</span>
          <span className="line"></span>
          <span className="s">{t('tradingCompetition16')}</span>
        </ContentL>
        <ContentR>
          <TabH mb='4px' bg='rgba(100, 58, 255, 0.3)'>
            <span>{t('tradingCompetition17')}</span>
            <span>{t('tradingCompetition18')}</span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.25)'>
            <span>≥1,000 </span>
            <span>{userHabit?.locale === 'ko_KR' ? '500' : '100'}</span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.2)'>
            <span>{userHabit?.locale === 'ko_KR' ? '≥500' : '≥800'}</span>
            <span>{userHabit?.locale === 'ko_KR' ? '200' : '60'} </span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.1)'>
            <span>{userHabit?.locale === 'ko_KR' ? '≥300' : '≥400'}</span>
            <span>{userHabit?.locale === 'ko_KR' ? '120' : '30'} </span>
          </TabH>
          {userHabit?.locale === 'ko_KR' && <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.05)'>
            <span>≥100 </span>
            <span>50 </span>
          </TabH>}
        </ContentR>
      </Content>
    </B>
    <Dis d={0} mt='24px'>
      <Img src="/images/tradingCompetition/BS.png" alt="" />
    </Dis>
    <B bg={`url('/images/tradingCompetition/BG2.png')`} h='606px'>
      <StepT>
        <span className="l"></span>
        <span className="r"></span>
        <span className="t">{t('tradingCompetition19')}</span>
      </StepT>
      <Content>
        <ContentL>
          <span className="t">{t('tradingCompetition20')}</span>
          <span className="line"></span>
          <span className="s">{t('tradingCompetition21')}</span>
        </ContentL>
        <ContentR>
          <TabH mb='4px' bg='rgba(100, 58, 255, 0.3)'>
            <span>{t('tradingCompetition33')}</span>
            {/* <span>{t('tradingCompetition18')}</span> */}
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.25)'>
            <span>{t('tradingCompetition34')}</span>
            <span>60000</span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.2)'>
            <span>{t('tradingCompetition35')}</span>
            <span>6000</span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.1)'>
            <span>{t('tradingCompetition36')}</span>
            <span>3000</span>
          </TabH>
          <TabH mb='1px' mr='1px' bg='rgba(100, 58, 255, 0.05)'>
            <span>{t('tradingCompetition37')}</span>
            <span>{t('tradingCompetition39')}</span>
          </TabH>
        </ContentR>
      </Content>
    </B>
    <Dis d={0} mt='24px'>
      <Img src="/images/tradingCompetition/BR.png" alt="" />
    </Dis>
  </Step>
}

export default step