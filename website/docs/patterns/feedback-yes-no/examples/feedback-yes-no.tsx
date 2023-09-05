import React from 'react';
import FeedbackForm from '@semcore/ui/feedback-form';
import Input from '@semcore/ui/input';
import { Box, Flex } from '@semcore/ui/flex-box';
import Link from '@semcore/ui/link';
import Dropdown from '@semcore/ui/dropdown';
import Textarea from '@semcore/ui/textarea';
import Notice from '@semcore/ui/notice';
import Button from '@semcore/ui/button';
import ThumbUpM from '@semcore/ui/icon/ThumbUp/m';
import ThumbDownM from '@semcore/ui/icon/ThumbDown/m';
import { Text } from '@semcore/ui/typography';

const validate = {
  description: (value = '') => {
    const splitText = value.split(' ');
    const numberSpaces = splitText.reduce((acc, item) => {
      if (!item.length) {
        acc += 1;
      }
      return acc;
    }, 0);
    if (value.length - numberSpaces < 10 || splitText.length <= 2) {
      return 'Your feedback must contain at least 3 words (10 characters).';
    }
  },
  email: (value = '') => {
    validate.description(value);
    if (!/.+@.+\..+/i.test(String(value).toLowerCase())) {
      return 'Please enter valid email.\t';
    }
  },
};

class Feedback extends React.PureComponent<{
  status: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onChange?: (event: any, trigger: string) => void;
  value?: { description: string; email: string };
}> {
  handleChange = (fn) => (_, e) => {
    fn(e);
  };

  render() {
    const { status, onSubmit, onCancel } = this.props;

    if (status === 'success') {
      return <FeedbackForm.Success>Thank you for your feedback!</FeedbackForm.Success>;
    }

    return (
      <FeedbackForm onSubmit={onSubmit} loading={status === 'loading'}>
        <Box p={4}>
          <Flex tag='label' direction='column' htmlFor='suggestions'>
            <Text mb={2} size={200}>
              Tell us your suggestion or report an issue
            </Text>
            <FeedbackForm.Item name='feedback' validate={validate.description}>
              {({ input }) => (
                <Textarea
                  {...input}
                  autoFocus
                  h={80}
                  onChange={this.handleChange(input.onChange)}
                  id='suggestions'
                />
              )}
            </FeedbackForm.Item>
          </Flex>
          <Flex tag='label' mt={4} direction='column' htmlFor='email'>
            <Text mb={2} size={200}>
              Reply-to email
            </Text>
            <FeedbackForm.Item name='email' validate={validate.email}>
              {({ input }) => (
                <Input state={input.state}>
                  <Input.Value {...input} onChange={this.handleChange(input.onChange)} id='email' />
                </Input>
              )}
            </FeedbackForm.Item>
          </Flex>
          <Box mt={2}>
            <Text lineHeight='18px' size={200} color='#6c6e79'>
              We will only use this email to respond to you on your feedback.{' '}
              <Link href='https://www.semrush.com/company/legal/privacy-policy/'>
                Privacy Policy
              </Link>
            </Text>
          </Box>
          <Flex mt={4}>
            <FeedbackForm.Submit>Send feedback</FeedbackForm.Submit>
            <FeedbackForm.Cancel onClick={onCancel}>Cancel</FeedbackForm.Cancel>
          </Flex>
        </Box>
        <FeedbackForm.Notice hidden={status === 'failed'}>
          You can also send us an email to <Link>backlink.audit@semrush.com</Link>
        </FeedbackForm.Notice>
        <FeedbackForm.Notice hidden={status !== 'failed'} theme='danger'>
          Your message has not been sent.
        </FeedbackForm.Notice>
      </FeedbackForm>
    );
  }
}

class FeedbackYesNo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { status: 'default', visible: true };
    this.onSubmit = () => {
      this.requestServer('success', 1000);
      this.setState({ status: 'loading' });
    };
    this.requestServer = (status, time, cb?: () => void) => {
      this.timeout = setTimeout(() => {
        this.setState({ status });
        cb?.();
      }, time || 500);
    };
    this.changeVisible = (visible) => {
      this.setState({ visible });
    };
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { status, visible } = this.state;

    return (
      <Notice
        hidden={!visible}
        style={{
          borderTop: 'none',
          borderRight: 'none',
          borderLeft: 'none',
          borderRadius: '0',
        }}
      >
        <Notice.Label mr={3} aria-hidden={true}>
          <img
            width='40'
            height='40'
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Cpath d='M35.3993 11.3303V27.8755C35.3993 28.4159 35.3402 28.9402 35.2219 29.4456C34.5202 32.5805 31.7402 34.9114 28.4064 34.9114H23.7875C19.787 34.9114 15.8402 36.0299 12.4338 38.1592C12.251 38.2883 11.9929 38.1323 11.9929 37.8984V34.9114C10.3502 34.9114 8.84192 34.3442 7.6509 33.3951C6.20984 32.2498 5.23121 30.5426 5.03495 28.5988C5.01344 28.3622 5 28.1202 5 27.8755V11.3303C5 8.91595 6.20178 6.78931 8.03536 5.52301C8.59727 5.13317 9.22101 4.82399 9.88777 4.61428C10.2131 4.51212 10.5465 4.43146 10.8879 4.38038C11.2482 4.32123 11.6165 4.29166 11.9929 4.29166H16.6118C17.1172 4.29166 17.6227 4.27284 18.1281 4.23789C20.2763 4.08733 22.3922 3.61414 24.3951 2.83447C25.6345 2.35591 26.8309 1.75636 27.9682 1.04659C28.1483 0.917538 28.4064 1.07347 28.4064 1.30738V4.29166C28.557 4.29166 28.7049 4.29703 28.85 4.3051C29.1861 4.32661 29.5141 4.37231 29.834 4.43953C30.4632 4.57126 31.06 4.78635 31.6139 5.07671C32.1381 5.35094 32.6247 5.68701 33.0603 6.07954C33.3211 6.31344 33.563 6.56616 33.7862 6.8377C34.7917 8.05293 35.3993 9.61765 35.3993 11.3303Z' fill='%236EDBFF'/%3E%3Cpath d='M27.8386 18.3976C27.2153 13.9661 25.8396 9.88218 24.4711 7.71481C24.249 7.35298 23.8863 6.8801 23.6785 6.6365C23.3525 6.25676 23.1234 5.98117 22.7301 6.09197C22.7265 6.09197 22.7265 6.09197 22.7265 6.09197C22.7086 6.0848 22.6871 6.08122 22.6692 6.08122C22.6692 6.08122 22.6656 6.08122 22.662 6.08122C22.619 6.08122 22.576 6.0848 22.5366 6.09555C22.4292 6.1457 22.3468 6.24601 22.2823 6.38573C22.2787 6.38931 22.2787 6.39289 22.2787 6.39647C22.2465 6.46454 22.2214 6.54694 22.1999 6.6365C22.1963 6.65441 22.1927 6.67232 22.1891 6.69382C22.1354 6.96608 22.1211 7.31716 22.139 7.71481C22.182 8.68923 22.4041 9.9395 22.6441 11.0321C22.6441 11.0465 22.6477 11.0608 22.6548 11.0715C22.7731 11.6304 22.8949 12.1427 22.9988 12.5547C22.5796 11.0393 22.0602 9.26189 21.4082 7.69637C20.7132 6.03054 19.9445 4.45657 19.203 3.77591C18.8232 3.42483 18.3846 3.42664 18.0371 3.54486C18.0192 3.54844 18.0049 3.55561 17.9905 3.56636C17.8687 3.62367 17.7863 3.74548 17.7433 3.91743C17.7398 3.92102 17.7398 3.92102 17.7398 3.9246C17.5714 4.60168 17.9404 6.05614 18.4419 7.71481C18.922 9.29466 19.5166 11.0536 19.8713 12.4866C19.8713 12.4866 19.8713 12.4866 19.8713 12.4902C20.0253 13.1064 20.1328 13.6652 20.1686 14.1202C19.9394 12.612 19.0741 10.0183 17.9778 7.71481C17.2291 6.13854 16.3916 4.58386 15.6501 3.72408C15.0948 3.07924 14.5335 2.87495 14.1502 3.07198C14.1215 3.08631 14.0964 3.10064 14.0749 3.12213C14.0498 3.14005 14.0284 3.16512 14.0069 3.19378C13.9961 3.20453 13.9889 3.21886 13.9818 3.22961C13.9531 3.26901 13.9316 3.312 13.9137 3.36216C13.8994 3.40156 13.8886 3.43739 13.8779 3.48396C13.8779 3.48396 13.8743 3.48754 13.8743 3.49112C13.8707 3.49829 13.8707 3.50187 13.8707 3.50545C13.8636 3.5377 13.8564 3.56994 13.8528 3.60576C13.8457 3.63084 13.8421 3.6595 13.8421 3.68458C13.8385 3.69532 13.8385 3.70965 13.8385 3.72398C13.8349 3.75981 13.8313 3.79563 13.8313 3.83146C13.8242 3.97475 13.8277 4.13596 13.8457 4.3115C13.8492 4.37598 13.8564 4.44047 13.8636 4.50853C13.8958 4.77363 13.946 5.07098 14.014 5.38981C14.0284 5.46146 14.0427 5.53311 14.0606 5.60476C14.0749 5.67282 14.0893 5.74089 14.1072 5.80896C14.1537 6.00241 14.2039 6.20302 14.2576 6.4108C14.3006 6.5756 14.3472 6.74397 14.3938 6.91593C14.4009 6.93742 14.4045 6.95533 14.4117 6.97683C14.4547 7.12371 14.4941 7.27059 14.5406 7.42105C14.58 7.56076 14.623 7.70406 14.666 7.84736C15.0601 9.15495 15.5366 10.5736 15.9557 11.8848C16.3211 13.0311 16.6471 14.0951 16.837 14.937C16.8943 15.1985 16.9409 15.4349 16.9695 15.6499C15.8052 11.9528 14.627 9.56564 13.4448 8.1864C12.8358 7.46991 12.0692 6.81941 11.6071 6.59371C11.2166 6.40026 10.9224 6.5756 10.7039 6.66874C10.5928 6.71531 10.514 6.79771 10.4603 6.91593C10.4423 6.95175 10.428 6.99474 10.4173 7.04131C10.4173 7.04489 10.4173 7.0449 10.4173 7.04848C10.2919 7.55718 10.5212 8.45995 10.8687 9.41646V9.42005C11.2806 10.5521 11.8538 11.7522 12.2049 12.4687C12.47 13.0096 12.7208 13.5577 12.9357 14.1238C13.6235 15.915 14.4726 18.0895 14.9705 19.9846V19.9882C14.9956 20.0849 15.0207 20.1781 15.0458 20.2748C14.3293 19.6801 13.4874 19.0389 12.6563 18.6197C11.363 17.9749 10.0196 17.3874 8.59381 17.3623C8.44335 17.3551 8.29289 17.3587 8.13884 17.3695C7.70179 17.3981 7.18233 17.5307 7.03545 17.9462C7.03545 17.9498 7.03187 17.9534 7.03187 17.957C7.03187 17.957 7.03187 17.9606 7.03187 17.9641C7.02112 18 7.01396 18.0322 7.00679 18.0644C6.97813 18.2686 7.04262 18.4836 7.15367 18.6591C7.28981 18.8705 7.48326 19.0353 7.67313 19.1929C9.03087 20.3285 10.4065 21.457 11.621 22.7431C12.8354 24.0292 13.8958 25.4944 14.5227 27.1495C14.5442 27.2032 14.5657 27.257 14.5872 27.3107C14.598 27.3322 14.6051 27.3573 14.6159 27.3788C14.6159 27.3823 14.6195 27.3859 14.6195 27.3895C14.6266 27.411 14.6374 27.4289 14.6445 27.4504C14.6445 27.454 14.6481 27.454 14.6481 27.4576C14.6768 27.5328 14.709 27.6045 14.7448 27.6761C14.7771 27.7513 14.8129 27.8266 14.8487 27.8982C14.9025 28.0093 14.9598 28.1167 15.0207 28.2242C15.0708 28.3138 15.121 28.4033 15.1747 28.4893C15.2249 28.5681 15.275 28.6469 15.3288 28.7222C15.3646 28.7795 15.404 28.8368 15.447 28.8905C15.5043 28.9694 15.5652 29.0446 15.6261 29.1198C15.9629 29.5282 16.3605 29.8865 16.8298 30.1731C17.9619 30.8645 19.3089 31.1511 20.6344 31.1511C21.967 31.1546 23.3176 30.8788 24.4855 30.2304C25.6498 29.5855 26.7746 28.2923 27.2404 27.042C27.2404 27.0241 27.2368 27.0098 27.2368 26.9919C27.2332 26.9775 27.2332 26.9632 27.2296 26.9453C27.2224 26.8772 27.2153 26.8092 27.2117 26.7375C27.1974 26.5906 27.183 26.4437 27.1723 26.2933C27.1508 26.0425 27.1365 25.7882 27.1221 25.5302C27.1114 25.3439 27.1042 25.1577 27.1006 24.9678C27.0935 24.7313 27.0899 24.4949 27.0899 24.2549C27.0899 24.1546 27.0899 24.0543 27.0935 23.9504C27.0971 23.8501 27.1006 23.7426 27.1042 23.6351C27.1042 23.5814 27.1078 23.5241 27.1114 23.4703C27.1186 23.3521 27.1257 23.2339 27.1329 23.1121C27.1436 22.9509 27.158 22.7861 27.1723 22.6177C27.201 22.324 27.2332 22.023 27.2726 21.7149C27.2833 21.6182 27.2941 21.5179 27.312 21.414C27.312 21.3925 27.3156 21.371 27.3192 21.3495C27.3335 21.2528 27.3478 21.1597 27.3622 21.0629C27.3801 20.9447 27.398 20.8229 27.4159 20.7011C27.4302 20.5972 27.4481 20.4897 27.466 20.3859C27.484 20.2605 27.5055 20.1315 27.5305 19.999C27.6237 19.4795 27.7276 18.9529 27.8422 18.4263C27.8422 18.4155 27.8386 18.4084 27.8386 18.3976ZM23.2352 13.4574C23.2101 13.3715 23.1707 13.2246 23.1206 13.0276C23.1671 13.1744 23.203 13.3177 23.2352 13.4574Z' fill='%236EDBFF'/%3E%3Cpath d='M20.04 10.6928C19.5563 8.98394 19.1336 7.26079 18.779 5.51973C18.6966 5.1185 18.6177 4.69936 18.736 4.30529C18.8506 3.9148 19.2268 3.56373 19.6316 3.62463C19.5671 3.3237 19.0937 3.24299 18.9652 3.02636C18.6607 2.97263 18.2747 2.98136 18.1135 3.24288C17.92 3.55455 18.0195 4.09034 18.0804 4.45217C18.4458 6.68402 19.0727 8.64719 20.04 10.6928Z' fill='white'/%3E%3Cpath d='M16.6147 19.621C16.3317 19.3846 15.9698 19.8539 15.651 19.621C15.1459 17.8298 14.2872 15.3293 13.6495 13.6706C13.4346 13.1046 13.1795 12.4393 12.9144 11.8984C12.1585 10.3544 10.2594 6.452 11.3091 6.01495C11.4739 5.9433 12.0578 6.1475 12.3301 6.24064C11.3915 6.78517 13.1397 10.4966 13.8813 12.0155C14.1464 12.5565 14.3971 13.1046 14.6121 13.6706C15.3357 15.555 16.131 17.6614 16.6147 19.621Z' fill='white'/%3E%3Cpath d='M15.6189 28.873C15.1819 28.3464 14.8451 27.7266 14.58 27.0639C14.5585 27.0101 14.6015 26.9126 14.58 26.8589C13.9531 25.2038 12.8145 23.561 11.6 22.2749C10.3856 20.9888 9.15983 19.9802 7.80209 18.8445C7.61222 18.6869 7.32565 18.4433 7.18951 18.232C7.05696 18.0206 6.94588 17.9358 7.02828 17.6994C7.17516 17.2838 7.61002 17.0354 8.04708 17.0068C8.20112 16.996 8.50919 16.9996 8.65965 17.0068C8.35872 17.5119 8.58305 18.5807 11.1051 20.397C14.6803 22.9727 15.4076 26.8203 15.6189 28.873Z' fill='%236EDBFF'/%3E%3Cpath d='M16.3278 11.6435C16.2382 11.7582 16.163 11.8836 16.1021 12.0161C14.9127 8.29754 13.3016 3.57273 14.3261 3.0497C14.7094 2.85267 15.241 3.26252 15.7963 3.90736C15.5205 4.04707 15.2459 4.38911 15.1527 4.69362C15.0166 5.12709 15.0739 5.59997 15.142 6.05136C15.4214 7.93572 15.8191 9.80574 16.3278 11.6435Z' fill='white'/%3E%3Cpath d='M23.5649 6.6483C23.246 6.67338 22.9666 6.88474 22.7911 7.14984C22.6155 7.41494 22.5295 7.73019 22.4686 8.04186C22.3218 8.83 22.3325 9.64679 22.4973 10.4349C22.157 9.37453 21.9743 8.19591 22.0029 7.08177C22.0137 6.70203 22.0817 6.25781 22.4149 6.07511C22.6227 5.96047 22.8842 5.98555 23.0956 6.09302C23.3069 6.20049 23.4287 6.45485 23.5649 6.6483Z' fill='white'/%3E%3Cmask id='mask0_10142_192435' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='5' y='1' width='31' height='38'%3E%3Cpath d='M35.3993 11.3303V27.8755C35.3993 28.4159 35.3402 28.9402 35.2219 29.4456C34.5202 32.5805 31.7402 34.9114 28.4064 34.9114H23.7875C19.787 34.9114 15.8402 36.0299 12.4338 38.1592C12.251 38.2883 11.9929 38.1323 11.9929 37.8984V34.9114C10.3502 34.9114 8.84192 34.3442 7.6509 33.3951C6.20984 32.2498 5.23121 30.5426 5.03495 28.5988C5.01344 28.3622 5 28.1202 5 27.8755V11.3303C5 8.91595 6.20178 6.78931 8.03536 5.52301C8.59727 5.13317 9.22101 4.82399 9.88777 4.61428C10.2131 4.51212 10.5465 4.43146 10.8879 4.38038C11.2482 4.32123 11.6165 4.29166 11.9929 4.29166H16.6118C17.1172 4.29166 17.6227 4.27284 18.1281 4.23789C20.2763 4.08733 22.3922 3.61414 24.3951 2.83447C25.6345 2.35591 26.8309 1.75636 27.9682 1.04659C28.1483 0.917538 28.4064 1.07347 28.4064 1.30738V4.29166C28.557 4.29166 28.7049 4.29703 28.85 4.3051C29.1861 4.32661 29.5141 4.37231 29.834 4.43953C30.4632 4.57126 31.06 4.78635 31.6139 5.07671C32.1381 5.35094 32.6247 5.68701 33.0603 6.07954C33.3211 6.31344 33.563 6.56616 33.7862 6.8377C34.7917 8.05293 35.3993 9.61765 35.3993 11.3303Z' fill='%23B880FF'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_10142_192435)'%3E%3Cpath d='M26.2578 35.5L15.258 38.5C15.258 38.5 15.5581 37 15.5581 34.5C15.5581 34.5 14.7859 28.5272 15.0581 27.8C16.7578 30.5 23.758 33 27.258 27C27.7578 29 26.2578 35.5 26.2578 35.5Z' fill='black'/%3E%3Cpath d='M14.4724 27.2791C14.8486 29.3784 15.4724 34.93 14.9688 37.93C14.1699 39.4525 13.6115 38.9793 12.4688 40.2654C11.5266 41.3222 8.09572 39.6457 6.83112 40.2654C6.55886 40.4016 6.28301 40.5198 6 40.6237L8.59726 47.2512C9.17762 47.072 9.75081 46.8714 10.3168 46.6565C15.9627 44.5142 21.3935 43.7985 24.9688 38.93C26.2011 37.2534 26.9688 31.43 27.1488 27' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cpath d='M15.6631 19.6564C15.1795 17.6968 14.2767 15.3897 13.553 13.5053C13.3381 12.9393 13.0873 12.3912 12.8222 11.8502C12.0663 10.3062 10.2715 6.48734 11.3212 6.05029C12.292 5.62756 15.3084 7.80568 17.5869 15.0314' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M19 20C19.7165 20.2114 20.4079 20.5159 21.042 20.9099' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M27.2408 26.6843C27.2228 26.7345 27.2013 26.7846 27.1799 26.8348C26.6855 28.0385 25.6036 29.2529 24.4859 29.8727C23.318 30.5211 21.9674 30.797 20.6348 30.7934C19.3093 30.7934 17.9623 30.5068 16.8302 29.8154C15.7949 29.1849 15.1178 28.2176 14.6521 27.1035C14.627 27.0533 14.6091 27.0032 14.5876 26.953C14.5661 26.8993 14.5446 26.8455 14.5231 26.7918C13.8962 25.1367 12.8358 23.6715 11.6214 22.3854C10.4069 21.0993 9.03127 19.9709 7.67353 18.8352C7.48366 18.6776 7.29021 18.5128 7.15407 18.3015C7.02152 18.0901 6.95346 17.825 7.03585 17.5885C7.18273 17.173 7.70219 17.0404 8.13924 17.0118C9.73701 16.9043 11.2273 17.5491 12.6567 18.262C13.4878 18.6812 14.3297 19.3224 15.0462 19.9171C16.2785 19.7165 17.5503 19.8025 18.7468 20.1536' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M19 15.4795C20.8414 14.7237 22.7866 14.2257 24.7605 14' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M17 16.5553C17.4048 16.3582 17.8168 16.172 18.2359 16' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M17.1422 15.6357C16.7016 12.5011 12.8827 3.79222 14.3228 3.05782C15.9636 2.21595 19.8326 10.7923 20.3413 14.106' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M23 13C23.086 13.3475 23.154 13.5947 23.1827 13.695' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M27.1087 26.7883C28.4287 18.7183 24.6292 7.52851 23.164 6.17793C22.7664 5.81252 22.1108 6.0418 22.0356 6.57558C21.8421 7.94049 22.4834 10.7957 22.8667 12.3039' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M23.5615 13.0391C23.5615 13.0355 23.5615 13.0319 23.5579 13.0284C23.5543 13.0176 23.5507 13.0033 23.5471 12.9925C23.4934 12.7704 23.4325 12.5376 23.3644 12.2975C23.3537 12.2402 23.3358 12.1793 23.3179 12.1184C23.3143 12.0969 23.3071 12.0719 23.3 12.0504C22.2002 8.09536 20.0041 2.46736 18.3383 3.04055C16.9555 3.50627 20.2441 10.6711 20.4698 13.6159' stroke='black' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M33.5 9L29 13.5' stroke='white' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M28 11.5L30.5 7' stroke='white' stroke-width='0.4' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
            alt='pen'
          />
        </Notice.Label>
        <Notice.Content>
          <Text mr={4}>Do you find our On Page SEO Checker reports useful?</Text>
          <Box mt={2} inline>
            <Dropdown>
              <Dropdown.Trigger>
                <Button>
                  <Button.Addon>
                    <ThumbUpM />
                  </Button.Addon>
                  <Button.Text>Yes</Button.Text>
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popper>
                {(_props, { visible }) => (
                  <Feedback
                    status={status}
                    onCancel={() => visible(false)}
                    onSubmit={() => this.onSubmit()}
                  />
                )}
              </Dropdown.Popper>
            </Dropdown>
            <Dropdown>
              <Dropdown.Trigger ml={2}>
                <Button>
                  <Button.Addon>
                    <ThumbDownM />
                  </Button.Addon>
                  <Button.Text>No</Button.Text>
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popper>
                {(_props, { visible }) => (
                  <Feedback
                    status={status}
                    onCancel={() => visible(false)}
                    onSubmit={() => this.onSubmit()}
                  />
                )}
              </Dropdown.Popper>
            </Dropdown>
            <Button ml={2} use='tertiary' onClick={() => this.changeVisible(false)}>
              Ask me later
            </Button>
          </Box>
        </Notice.Content>
        <Notice.CloseIcon onClick={() => this.changeVisible(false)} />
      </Notice>
    );
  }
}

export default FeedbackYesNo;
