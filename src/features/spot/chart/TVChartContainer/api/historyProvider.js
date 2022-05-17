import { getKline } from "../../../../../services/api/spot";
import store from "../../../../../store/store";
import { changeResolution } from "../../../../../store/modules/spotSlice";

const history = {};

export default {
  history: history,

  getBars: function (symbolInfo, resolution, from, to, first, limit) {
    let spotId = store.getState().spot.spotId || 1000000;
    store.dispatch(changeResolution(resolution));

    let resolutionArr = [
      ["1", "60000"],
      ["3", "180000"],
      ["5", "300000"],
      ["15", "900000"],
      ["30", "1800000"],
      ["60", "3600000"],
      ["120", "7200000"],
      ["240", "14400000"],
      ["360", "21600000"],
      ["720", "43200000"],
      ["1D", "86400000"],
      ["1W", "604800000"]
    ];
    let qsResolution;

    resolutionArr.forEach((el) => {
      if (el[0] === resolution) {
        qsResolution = el[1];
      }
    });

    const qs = {
      symbol: spotId,
      range: qsResolution,
      point: 1440
    };

    return getKline(qs).then((response) => {
      let res = response.data;
      let data = res.data;

      const dataInRange = data.lines.length
        ? data.lines.filter((n) => n[0] / 1000 >= from && n[0] / 1000 <= to)
        : [];

      if (dataInRange) {
        var bars = dataInRange.map((el) => {
          return {
            time: Number(el[0]), // TradingView requires bar time in ms
            low: Number(el[3]),
            high: Number(el[2]),
            open: Number(el[1]),
            close: Number(el[4]),
            volume: Number(el[5])
          };
        });

        if (first) {
          var lastBar = bars[bars.length - 1];
          history[symbolInfo.name] = {
            lastBar: lastBar
          };
        }

        return bars;
      } else {
        return [];
      }
    });
  }
};
