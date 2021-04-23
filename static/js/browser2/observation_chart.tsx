/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Component for displaying a line chart for a single source series.
 */

import React from "react";
import axios from "axios";
import { DataGroup, DataPoint } from "../chart/base";
import { drawLineChart } from "../chart/draw";
import { getUnit } from "./util";
import { SourceSeries } from "./types";
import { randDomId } from "../shared/util";
import { URI_PREFIX } from "./constants";

// Chart size
const HEIGHT = 220;

// Only show dots when there's only a single data point
const MAX_DOTS = 1;
const NO_OBSDCID_ERROR_MESSAGE =
  "Sorry, could not open the browser page for the selected Observation Node.";

interface ObservationChartPropType {
  sourceSeries: SourceSeries;
  idx: number;
  statVarId: string;
  placeDcid: string;
  canClickObs: boolean;
  statVarName?: string;
  dateToDcid?: { [date: string]: string };
}

interface ObservationChartStateType {
  chartWidth: number;
  errorMessage: string;
  showTableView: boolean;
}

export class ObservationChart extends React.Component<
  ObservationChartPropType,
  ObservationChartStateType
> {
  private chartId: string;
  private chartContainerId: string;
  private sortedDates: string[] = Object.keys(
    this.props.sourceSeries.val
  ).sort();
  private svgContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ObservationChartPropType) {
    super(props);
    this.state = {
      chartWidth: 0,
      errorMessage: "",
      showTableView: false,
    };
    this.chartId = randDomId();
    this.chartContainerId = this.chartId + "container";
    this.svgContainerRef = React.createRef();
    // Consider debouncing / throttling this if it gets expensive at
    // small screen sizes
    this._handleWindowResize = this._handleWindowResize.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener("resize", this._handleWindowResize);
    this.plot();
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this._handleWindowResize);
  }

  render(): JSX.Element {
    let svgContainerClass = this.props.canClickObs ? "clickable" : "no-click";
    if (Object.keys(this.props.sourceSeries.val).length > MAX_DOTS) {
      svgContainerClass = svgContainerClass + " hide-dots";
    }
    const obsTableRowClass = this.props.canClickObs
      ? "observation-table-row-clickable"
      : "observation-table-row";
    const chartVisibility = this.state.showTableView ? "none" : "block";
    const tableVisibility = this.state.showTableView ? "block" : "none";
    const unit = getUnit(this.props.sourceSeries);
    return (
      <>
        <button
          className="btn btn-sm btn-light chart-toggle"
          onClick={() =>
            this.setState({ showTableView: !this.state.showTableView })
          }
        >
          <i className="material-icons">
            {this.state.showTableView ? "show_chart" : "table_view"}
          </i>
          <span>{this.state.showTableView ? "show chart" : "show table"}</span>
        </button>
        <div className="observation-chart">
          <div id={this.chartContainerId} style={{ position: "relative" }}>
            <div style={{ display: tableVisibility }}>
              <div className="observations-table card p-0">
                <table className="node-table">
                  <tbody>
                    <tr key="header">
                      <td>
                        <strong>Date</strong>
                      </td>
                      <td>
                        <strong>
                          {this.props.statVarName
                            ? this.props.statVarName
                            : this.props.statVarId}
                        </strong>
                      </td>
                    </tr>
                    {this.sortedDates.map((date) => {
                      if (date in this.props.sourceSeries.val) {
                        return (
                          <tr
                            className={obsTableRowClass}
                            key={date}
                            onClick={() => this.redirectToObsPage(date)}
                          >
                            <td>{date}</td>
                            <td
                              className={
                                this.props.canClickObs
                                  ? "clickable-text"
                                  : undefined
                              }
                            >
                              {this.props.sourceSeries.val[date] + unit}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              id={this.chartId}
              className={svgContainerClass}
              style={{ display: chartVisibility }}
              ref={this.svgContainerRef}
            />
            <div id="screen" className="screen">
              <div id="spinner"></div>
            </div>
          </div>
          {this.state.errorMessage ? (
            <div className="error-message">{this.state.errorMessage}</div>
          ) : null}
        </div>
      </>
    );
  }

  private _handleWindowResize(): void {
    if (this.svgContainerRef.current) {
      const width = this.svgContainerRef.current.offsetWidth;
      if (width !== this.state.chartWidth) {
        this.setState({
          chartWidth: width,
        });
        this.plot();
      }
    }
  }

  private plot(): void {
    this.svgContainerRef.current.innerHTML = "";
    const values = this.props.sourceSeries.val;
    const data = [];
    this.sortedDates.forEach((key) => {
      data.push({
        label: key,
        time: new Date(key).getTime(),
        value: Number(values[key]),
      });
    });
    const dataGroups = [new DataGroup(this.props.statVarId, data)];
    drawLineChart(
      this.chartId,
      this.svgContainerRef.current.offsetWidth,
      HEIGHT,
      dataGroups,
      true,
      true,
      getUnit(this.props.sourceSeries),
      this.props.canClickObs ? this.handleDotClick : null
    );
  }

  private handleDotClick = (dotData: DataPoint): void => {
    const date = dotData.label;
    this.redirectToObsPage(date);
  };

  private redirectToObsPage(date: string): void {
    if (!this.props.canClickObs) {
      return;
    }
    if (date in this.props.dateToDcid) {
      const obsDcid = this.props.dateToDcid[date];
      const uri = URI_PREFIX + obsDcid;
      window.open(uri);
    } else {
      // TODO(chejennifer): triggers pop up warning because opening the new tab
      // is not result of user action. Find better way to do this.
      this.loadSpinner();
      let request = `/api/browser/observation-id?place=${this.props.placeDcid}&statVar=${this.props.statVarId}&date=${date}`;
      if (this.props.sourceSeries.measurementMethod) {
        request = `${request}&measurementMethod=${this.props.sourceSeries.measurementMethod}`;
      }
      if (this.props.sourceSeries.observationPeriod) {
        request = `${request}&obsPeriod=${this.props.sourceSeries.observationPeriod}`;
      }
      axios
        .get(request)
        .then((resp) => {
          this.removeSpinner();
          const obsDcid = resp.data;
          if (obsDcid) {
            const uri = URI_PREFIX + obsDcid;
            window.open(uri);
          } else {
            this.updateErrorMessage(NO_OBSDCID_ERROR_MESSAGE);
          }
        })
        .catch(() => {
          this.removeSpinner();
          this.updateErrorMessage(NO_OBSDCID_ERROR_MESSAGE);
        });
    }
  }

  private updateErrorMessage(message: string): void {
    this.setState({
      errorMessage: message,
    });
  }

  private loadSpinner(): void {
    document
      .getElementById(this.chartContainerId)
      .getElementsByClassName("screen")[0]
      .classList.add("d-block");
  }

  private removeSpinner(): void {
    document
      .getElementById(this.chartContainerId)
      .getElementsByClassName("screen")[0]
      .classList.remove("d-block");
  }
}
