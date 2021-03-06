const React = require('react');

const Message = require('../../../MapStore2/web/client/components/I18N/Message');

const assign = require('object-assign');
const PropTypes = require('prop-types');

class BestEffort extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        style: PropTypes.object,
        message: PropTypes.string
    };

    static defaultProps = {
        id: 'brugis-besteffort',
        message: 'notinmyname'
    };
    render() {
        return (
          <div id={this.props.id} style={this.props.style}>
              <label><Message msgId="best-effort" /><a href="mailto:brugis@urban.brussels"><Message msgId="BruGISTeam" /></a></label>
          </div>
        );
    }
}

module.exports = {
    BestEffortPlugin: assign(BestEffort, {
        MapFooter: {
            name: 'bestEffort',
            position: 1,
            tool: true,
            priority: 1
        }
    })
};
