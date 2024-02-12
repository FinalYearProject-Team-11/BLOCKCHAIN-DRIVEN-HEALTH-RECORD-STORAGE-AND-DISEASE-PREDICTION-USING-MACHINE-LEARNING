import Icon from '@mdi/react';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';

const NavBarVerticalButton = ({ activeComponent, setActiveComponent, name, icon}) => {

    const handleButtonClick = (buttonId) => {
        setActiveComponent(buttonId);
    };

    return (
        <li>
            <Link className="nav-vertical-link">
                <Button
                    variant={activeComponent ===  `${name}` ? 'soft' : 'plain'}
                    className="nav-vertical-button"
                    id="record"
                    onClick={() => handleButtonClick(`${name}`)}
                >
                    <div className="nav-vertical-bd1">
                        <Icon path={icon} size={1} />
                    </div>
                    <div className="nav-vertical-bd2">
                        <p className="nav-vertical-bd2-content">{name}</p>
                    </div>
                </Button>
            </Link>
        </li>
    )
}

export default NavBarVerticalButton