var React = require('react');
var Table = require('react-data-components').Table;
var Pagination = require('react-data-components').Pagination;
var SelectField = require('react-data-components').SelectField;
var SearchField = require('react-data-components').SearchField;

var DataMixin = require('react-data-components').DataMixin;

var DataTable = React.createClass({

  mixins: [ DataMixin ],

  render() {
    var page = this.buildPage();

    return (
      <div className={this.props.className}>
        
        <Table
          className="table table-bordered"
          dataArray={page.data}
          columns={this.props.columns}
          keys={this.props.keys}
          buildRowOptions={this.props.buildRowOptions}
          sortBy={this.state.sortBy}
          onSort={this.onSort}
        />
      </div>
    );
  },
});

module.exports = DataTable;
