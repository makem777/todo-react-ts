// 이 함수는 파라미터로 액션의 타입과 Promise를 만들어주는 함수를 받아옵니다.
export function createAsyncDispatcher(type: String, promiseFn: Function){
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // ...rest 를 사용하여 나머지 파라미터를 rest 배열에 담습니다.
  async function actionHandler(dispatch: any, ...rest: any[]) {
    dispatch({ type }); // 요청 시작
    try {
      const data = await promiseFn(...rest); // rest 배열을 spread로 넣어줍니다.
      dispatch({
        type: SUCCESS,
        data,
      }); // 성공함
    } catch (error) {
      dispatch({
        type: ERROR,
        error,
      })
    }
  }

  return actionHandler;
}

export interface IAsyncState {
  loading: boolean,
  data?: any,
  error: any,
}

export const initialAsyncState: IAsyncState = {
  loading: false,
  error: null,
}

// 로딩중일 때 바뀔 상태 객체
const loadingState: IAsyncState = {
  loading: true,
  data: undefined,
  error: null,
}

// 성공했을 때 상태 만들어 주는 함수
const success = (data: any) :IAsyncState => ({
  loading: false,
  data,
  error: null,
});

// 실패했을 때 상태 만들어 주는 함수
const error = (error: any) :IAsyncState => ({
  loading: false,
  data: null,
  error,
});

// 세가지 액션을 처리하는 리듀서를 만들어 줍니다.
export function createAsyncHandler(type: string, key: string) {
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  function handler(state: any, action: any) {
    debugger;
    switch (action.type) {
      case type:
        return {
          ...state,
          ...loadingState,
        };
      case SUCCESS:
        return {
          ...state,
          ...success(action.data),
        };
      case ERROR:
        return {
          ...state,
          ...error(action.error),
        };
      default:
        return state;
    }
  }

  return handler;
}
