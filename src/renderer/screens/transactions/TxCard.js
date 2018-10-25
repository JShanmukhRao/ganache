import React, { Component } from "react"
import { hashHistory } from "react-router"

import connect from "../helpers/connect"

import * as Transactions from "../../../common/redux/transactions/actions"

import DestinationAddress from "./DestinationAddress"
import TransactionTypeBadge from "./TransactionTypeBadge"

import FormattedEtherValue from "../../components/formatted-ether-value/FormattedEtherValue"

import EventList from "../events/EventList"

import OnlyIf from "../../components/only-if/OnlyIf"

class TxCard extends Component {
  componentDidMount() {
    this.props.dispatch(
      Transactions.showTransaction(this.props.transactionHash)
    )
  }

  render() {
    const {
      currentTransaction: tx,
      currentTransactionReceipt: receipt,
      currentTransactionData: decodedData,
      currentTransactionContract: contract
    } = this.props.transactions

    let events = this.props.transactions.currentTransactionEvents.map((event) => {
      return {
        name: event.decodedLog ? event.decodedLog.name : null,
        contract: contract ? contract.contractName : event.log.address,
        transactionHash: event.transactionHash,
        logIndex: event.logIndex,
        timestamp: event.log.timestamp
      }
    })

    if (!tx || !receipt) {
      return <div />
    }

    let contractInfo = null
    if (contract && decodedData) {
      contractInfo = {
        name: contract.contractName,
        address: contract.address,
        functionName: decodedData.name + "(" + decodedData.params.map((param) => param.name + ": " + param.type).join(", ") + ")",
        inputs: decodedData.params.map((param) => param.value),
        stateChanges: []
      }
    }

    return (
      <section className="TxCard">
        <div className="TxInfo">
          <header>
            <button className="Button" onClick={hashHistory.goBack}>
              &larr; Back
            </button>

            <div className="Title">
              <h1>TX {tx.hash}</h1>
            </div>
          </header>

          <section className="Parties">
            <div className="From">
              <div className="Label">SENDER ADDRESS</div>
              <div className="Value">{tx.from}</div>
            </div>
            <DestinationAddress tx={tx} receipt={receipt} />
            <div>
              <div className="Value">
                <div className="Type">
                  <TransactionTypeBadge tx={tx} receipt={receipt} />
                </div>
              </div>
            </div>
          </section>

          <section className="Gas">
            <div>
              <div className="Label">VALUE</div>
              <div className="Value">
                <FormattedEtherValue value={tx.value.toString()} />
              </div>
            </div>
            <div>
              <div className="Label">GAS USED</div>
              <div className="Value">{receipt.gasUsed}</div>
            </div>

            <div>
              <div className="Label">GAS PRICE</div>
              <div className="Value">{tx.gasPrice.toString()}</div>
            </div>

            <div>
              <div className="Label">GAS LIMIT</div>
              <div className="Value">{tx.gas}</div>
            </div>

            {/* <div>
              <div className="Label">MINED ON</div>
              <div className="Value">
                <Moment unix format="YYYY-MM-DD HH:mm:ss">
                  {EtherUtil.bufferToInt(tx.block.header.timestamp)}
                </Moment>
              </div>
            </div> */}

            <div>
              <div className="Label">MINED IN BLOCK</div>
              <div className="Value">{receipt.blockNumber}</div>
            </div>
          </section>
          <main>
            <div>
              <div className="Label">TX DATA</div>
              <div className="Value">{tx.input}</div>
            </div>
          </main>
        </div>

        <OnlyIf test={contractInfo != null}>
          <div className="ContractInfo">
            <header>
              <div className="Title">
                <h1>CONTRACT</h1>
              </div>
            </header>

            <section>
              <div>
                <div className="Label">CONTRACT</div>
                <div className="Value">{contractInfo.name}</div>
              </div>
              <div>
                <div className="Label">ADDRESS</div>
                <div className="Value">{contractInfo.address}</div>
              </div>
            </section>
            <section>
              <div>
                <div className="Label">FUNCTION</div>
                <div className="Value">{contractInfo.functionName}</div>
              </div>
            </section>
            <section>
              <div>
                <div className="Label">{contractInfo.inputs.length > 0 && "INPUTS"}</div>
                <div className="Value">{contractInfo.inputs.join(", ")}</div>
              </div>
              {/*<div> // TODO: implement state changes
                <div className="Label">STATE CHANGES</div>
                <div className="Value">
                  {contractInfo.stateChanges.map((state, index) => (
                    <div key={index}>{`${state.name}: ${state.prev} >> ${state.next}`}</div>
                  ))}
                </div>
              </div>*/}
            </section>
          </div>
        </OnlyIf>

        <div className="EventsInfo">
          <header>
            <div className="Title">
              <h1>EVENTS</h1>
            </div>
          </header>

          <EventList eventList={events} />
        </div>
      </section>
    )
  }
}

export default connect(
  TxCard,
  "transactions"
)
