import React, { Component} from 'react';
import axios from 'axios';
import DevicePrimaryComp from './DevicePrimaryComp';


/*
장비 검색시 기본 정보포함 UI 생성
*/
class DevicePrimaryCompList extends Component {

    state = {
      devicePartList : [],
      isChange : false
    };

    // 장비 하나 선택 후 deviceJs로 전달
    doSearchOne = (devicePart) => {
        // console.log (devicePart);
        this.props.doSearchOne(devicePart);
    };

    // 검색 버튼 질의시 부품장비 리스트 호출
    getDevicePartList = async (devicePartContainer) => {
      // 검색 요청이 없을때 수행하지 않음
      if (devicePartContainer === null) {
        return;
      }

      const response = await axios({
        method : 'post',
        url : '/devicePart/getList',
        headers : {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        data : devicePartContainer
      }).catch(function (error) {
        alert ("검색중 오류가 발생하여 작업을 중단합니다.");
      });

      if (response === undefined) {
        return;
      }
      // 인증 실패한 경우. login창으로 이동
      if (response.data.response.indexOf("403") > -1) {
        alert(response.data.response);
        return;
      }
      this.setState ({'devicePartList' : response.data.devicePartList});
    };

    // 첫 렌더링 마친후 일어나느 이벤트
    componentDidMount(){
      const { devicePartContainer } = this.props;
      const { devicePartList, isChange } = this.state;
      //isChangeconsole.log (devicePrimaryCompListIsMount + "componentDidMount");
      // 무한루프 방지, APP 실행시 첫 마운트에만 수행
      if (isChange) {
        return;
      }
      // this.getDevicePartList(devicePartContainer);
      // devic Component에 있는 search 변수 초기화
      // this.props.doSearchInitialize ();
      this.setState ({isChange : true});
      // debug
      //console.log (devicePartContainer.doSearchDefault);
    }
    //state,props 변경시 일어나는 이벤트
    // 부모딴에서  비지니스 로직제어해야함
    // 컴포넌트 변경시 두번의 렌더링 업데이트 수행하므로 제어
    componentDidUpdate(prevProps, prevState){
      let { devicePartContainer,isSearchList } = this.props;
      // devicePartContainer['doSearchDefault'] = true;
      // 무한루프 방지
      if (!isSearchList) {
        return;
      }
      // debug
      //console.log (devicePartContainer.doSearchDefault);
      this.getDevicePartList(devicePartContainer);
      // devic Component에 있는 search 변수 초기화
      this.props.doSearchInitialize ();
    }

  render() {
    const { devicePartList } = this.state;
    return (
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 device-bg-1 nopadding devicePartListWrapper">
            <ul className="list-group w-100">
                {devicePartList !== undefined && devicePartList.length > 0 &&
                  devicePartList.map((devicePart) => {
                    if (devicePart.deviceId !== undefined) {
                      devicePart.primaryName = devicePart.deviceModel + ' ' + devicePart.cpuInfo + ' ' + devicePart.ramInfo;
                    } else if (devicePart.partId !== undefined) {
                      devicePart.primaryName = devicePart.partModel + ' ' + devicePart.partManufactor;
                    }
                return (
                      <DevicePrimaryComp devicePart={devicePart} doSearchOne = {this.doSearchOne}/>
                    );
                  })}
            </ul>
          </div>
    );
  }
}
export default DevicePrimaryCompList;
