import { mdiHome, mdiClipboardEdit, mdiMagnifyScan } from '@mdi/js';
import NavBarVerticalButton from './NavBarVerticalButton';

function NavBarVertical({ activeComponent, setActiveComponent }) { 


    return (
    <div className="navbar-one">
        <div className='navbar-outer'>
            <ul className="nav-vertical-links">
                <NavBarVerticalButton 
                    activeComponent={activeComponent}
                    setActiveComponent={setActiveComponent} 
                    name='Records'
                    icon={mdiHome}
                />
                <NavBarVerticalButton 
                    activeComponent={activeComponent} 
                    setActiveComponent={setActiveComponent} 
                    name='Data'
                    icon={mdiClipboardEdit}
                />
                <NavBarVerticalButton 
                    activeComponent={activeComponent} 
                    setActiveComponent={setActiveComponent} 
                    name='Predictions'
                    icon={mdiMagnifyScan}
                />
            </ul>
            <hr/>
        </div>
    </div>
    )
}


export default NavBarVertical