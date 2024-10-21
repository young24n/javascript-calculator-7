import { MissionUtils } from '@woowacourse/mission-utils';

class App {
  splitLine(text) {
    // Todo: REGEX 더 적합한 이름으로 변경
    const IS_HAVE_DELIMITER = /^\/\/.*\\n/;
    let delimiter_line = '';
    let number_line = '';

    if (IS_HAVE_DELIMITER.test(text)) {
      [delimiter_line, number_line] = text.split('\\n');
      
      return { delimiter_line, number_line };
    }
    number_line = text;

    return { delimiter_line, number_line };
  }

  validateDelimiterLine(text) {
    const CHECK_INVALID_NUMBER_REGEX = /^\/\/\d{1,}$/;
    const CHECK_EMPTY_DELIMITER_REGEX = /^\/\/$/;
    const CHECK_LONG_DELIMITER_REGEX = /^\/\/.{2,}$/;
    const CHECK_EMPTY_REGEX = /^$/;
    const CAPTURE_DELIMITER = /^\/\/(.)$/;

    if (CHECK_INVALID_NUMBER_REGEX.test(text)) {
      throw new Error('[ERROR] 구분자로 숫자를 사용할 수 없습니다!');
    } 
    if (CHECK_EMPTY_DELIMITER_REGEX.test(text)) {
      throw new Error('[ERROR] 구분자를 공란으로 설정할 수 없습니다!');
    }
    if (CHECK_LONG_DELIMITER_REGEX.test(text)) {
      throw new Error('[ERROR] 구분자를 2자 이상으로 설정할 수 없습니다!');
    } 
    if (CHECK_EMPTY_REGEX.test(text)) {
      return text;
    }

    return text.match(CAPTURE_DELIMITER)[1];
  }

  validateNumberLine(text, delimiter = '') {
    const CHECK_EMPTY_REGEX = /^$/;
    const CHECK_START_LATTER_REGEX = /^\D/;
    const CHECK_LAST_LATTER_REGEX = /\D$/;
    const CHECK_NUMBER_DELIMITER_PATTERN_REGEX = new RegExp(`^\\d([${delimiter},:]\\d)*$`);
    const CHECK_DIGIT_NUMBER = /\d{2,}/;

    if (CHECK_EMPTY_REGEX.test(text)) {
      return text;
    }
    if (CHECK_START_LATTER_REGEX.test(text)) {
      throw new Error('[ERROR] 문장 양식이 올바르지 않습니다! 새로운 구분자를 등록하려는 경우 올바르게 입력했는지 확인해주세요.');
    }
    if (CHECK_LAST_LATTER_REGEX.test(text)) {
      throw new Error('[ERROR] 문장의 마지막은 숫자로 끝내야 합니다!');
    }
    if (CHECK_DIGIT_NUMBER.test(text)) {
      throw new Error('[ERROR] 최대 한 자리 숫자만 허용하고 있습니다!');
    }
    if (!CHECK_NUMBER_DELIMITER_PATTERN_REGEX.test(text)) {
      throw new Error(`[ERROR] 허용되지 않은 구분자가 포함되어있습니다! 사용가능한 구분자: ${delimiter},:`);
    }

    return text;
  }

  extractNumbers(number_line, delimiter) {
    const SPLIT_REGEX = new RegExp(`[${delimiter},:]`);
    return number_line.split(SPLIT_REGEX).map(Number);
  }


  async run() {
    try {
      const INPUT_DATA = await MissionUtils.Console.readLineAsync('덧셈할 문자열을 입력해 주세요.\n');
      const LINES = this.splitLine(INPUT_DATA);
      const VALIDATE_DELIMITER_LINE = await this.validateDelimiterLine(LINES.delimiter_line);
      const VALIDATE_NUMBER_LINE = await this.validateNumberLine(LINES.number_line, VALIDATE_DELIMITER_LINE);
      const EXTRACT_NUMBERS = await this.extractNumbers(VALIDATE_NUMBER_LINE, VALIDATE_DELIMITER_LINE);

      MissionUtils.Console.print(`${EXTRACT_NUMBERS}`)

    } catch (error) {
      throw error;  
    }  
  }
}

export default App;