<!-- @format -->

<template>
  <div class="map-box">
    <div ref="mapRef" :style="mapStyle" />
  </div>
</template>

<script>
import { defineComponent, watch, ref, reactive, onMounted } from "vue";
import loadScript from "@business/common/src/utils/load-script";
import { isEmpty } from "lodash";
import { TMAP_APP_KEY } from "@business/common/src/config/index";

export default defineComponent({
  name: "TencentMap",
  props: {
    // 坐标
    location: {
      type: Array,
      default: () => [105.0293195608, 36.6847961226],
    },
    // 地址
    addr: {
      type: String,
      default: "",
    },
    addressInfo: {
      type: Object,
      default: () => {},
    },
    // 缩放级别
    zoom: {
      type: Number,
      default: 17.2,
    },
    // 地图高度
    height: {
      type: String,
      default: "100%",
    },
    // 地图宽度
    width: {
      type: String,
      default: "100%",
    },
  },

  emits: ["noSearch", "location-change"],
  setup(props, { emit }) {
    const currentLocation = ref(props.location);
    const mapStyle = reactive({
      height: props.height,
      width: props.width,
    });
    const _map = ref(null);
    const _marker = ref(null);
    const _suggest = ref(null);
    const _infoWindow = ref(null);
    const mapRef = ref();

    watch(
      () => props.location,
      (val) => {
        currentLocation.value = val;
        if (_map.value) {
          setMarker(currentLocation.value, true);
        }
      }
    );

    watch(
      () => props.addr,
      () => {
        if (_map.value) {
          currentLocation.value = [];
          getLocation();
        }
      }
    );

    /**
     * 获取地理坐标
     */
    const getLocation = async () => {
      // 如果当前已经有location
      if (currentLocation.value.length) {
        setMarker(currentLocation.value, true);
        return;
      }

      // 如果传递了地址信息
      if (props.addr) {
        try {
          _suggest.value
            .getSuggestions({
              keyword: props.addr,
              location: _map.value.getCenter(),
            })
            .then((result) => {
              emit("location-change", result);
            });
        } catch (error) {
          emit("noSearch", false);
          console.log(error);
        }
      }
    };

    /**
     * 设置地图标记
     */
    const setMarker = (location, isRedirectToCenter) => {
      // console.log(location)
      const [lng, lat] = location;
      if (!lat || !lng) return;
      if (_marker.value) {
        clearMarker();
      }
      const point = new TMap.LatLng(lat, lng);
      _marker.value = new TMap.MultiMarker({
        map: _map.value, // 指定地图容器
        styles: {
          // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          myStyle: new TMap.MarkerStyle({
            width: 25, // 点标记样式宽度（像素）
            height: 35, // 点标记样式高度（像素）
            anchor: { x: 16, y: 32 },
            src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png", // 图片路径
          }),
        },
        geometries: [
          {
            id: "1", // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
            styleId: "myStyle", // 指定样式id
            position: point, // 点标记坐标位置
            properties: {
              // 自定义属性
              title: "marker",
            },
          },
        ],
      });

      if (!isEmpty(props.addressInfo)) {
        _infoWindow.value = new TMap.InfoWindow({
          position: point, // 显示信息窗口的坐标
          map: _map.value,
          content: `
          <h3 style="font-weight: bold">${props.addressInfo.title}</h3>
          <p style="color: #000;">
            地址: ${props.addressInfo.province}${props.addressInfo.city}${
            props.addressInfo.district || ""
          }
          </p>
        `, // 信息窗口内容
          offset: { x: 0, y: -50 },
        });
      }

      if (isRedirectToCenter) {
        _map.value.setCenter(point);
      }
    };

    /**
     * 清除所有标记
     */
    const clearMarker = () => {
      _marker.value?.setMap(null);
      _marker.value = null;
      _infoWindow.value?.close();
    };

    /**
     * 地图初始化
     * @author shiguohao
     */
    const initMap = () => {
      // 初始化
      if (!window.TMap.Map) return;
      console.log("初始化开始");

      const [lng, lat] = props.location;
      _map.value = new TMap.Map(mapRef.value, {
        center: new TMap.LatLng(lat, lng),
        zoom: props.zoom, // 设置地图缩放级别
        rotation: 20, // 设置地图旋转角度
        pitch: 30, // 设置俯仰角度（0~45）
      });

      // 新建一个关键字输入提示类
      _suggest.value = new TMap.service.Suggestion({
        pageSize: 20, // 返回结果每页条目数
      });

      getLocation();
    };

    onMounted(async () => {
      if (!window.TMap) {
        const func = "init_" + new Date().getTime();
        window[func] = initMap;
        await loadScript(
          `https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${TMAP_APP_KEY}&callback=${func}`
        );
      } else {
        initMap();
      }
    });

    return {
      mapRef,
      currentLocation,
      mapStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.map-box {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
