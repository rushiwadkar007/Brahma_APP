// ** Logo
import { InfinitySpin } from 'react-loader-spinner';
const LodderComponent = () => {
    return (
        <div className='row'>

            <InfinitySpin
                style={{
                    flex: "1",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                height="200"
                width="300"
                radius="9"
                color="white"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
        </div>
    )
}

export default LodderComponent
