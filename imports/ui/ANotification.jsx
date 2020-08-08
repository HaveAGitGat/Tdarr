import React from "react";
import { Button } from "react-bootstrap";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <div className="log-out">
                <div className="log-out2">
                <Button
                    variant="outline-light"
                    onClick={() => {
                        window.open('https://www.reddit.com/r/Tdarr/comments/i63ou3/tdarr_pro_containers_for_patreon_supporters/', "_blank")
                    }
                    }
                >
                    Get Tdarr Pro
                </Button>
                </div>
            </div>
        )
    }
}

