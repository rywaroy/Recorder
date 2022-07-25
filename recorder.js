class Recorder {
    static Stream;
    static Ctx;
    static Scope;
    static BufferSize = 4096;

    static IsOpen () {
        if(Recorder.Stream){
            const stream = Recorder.Stream;
            const tracks = stream.getTracks && stream.getTracks() || stream.audioTracks || [];
            const track = tracks[0];
            if(track){
                const state = track.readyState;
                return state === "live" || state === track.LIVE;
            };
        };
        return false;
    }

    static Support() {
        const AC = window.AudioContext;
        if(!AC){
            AC = window.webkitAudioContext;
        };
        if(!AC){
            return false;
        };
        const scope = navigator.mediaDevices || {};
        if(!scope.getUserMedia){
            scope = navigator;
            scope.getUserMedia || (scope.getUserMedia = scope.webkitGetUserMedia || scope.mozGetUserMedia || scope.msGetUserMedia);
        };
        if(!scope.getUserMedia){
            return false;
        };
        
        Recorder.Scope = scope;
        if(!Recorder.Ctx || Recorder.Ctx.state === 'closed'){
            //不能反复构造，低版本number of hardware contexts reached maximum (6)
            Recorder.Ctx = new AC();
            
            Recorder.BindDestroy('Ctx', function() {
                const ctx = Recorder.Ctx;
                if (ctx && ctx.close) {//能关掉就关掉，关不掉就保留着
                    ctx.close();
                    Recorder.Ctx = 0;
                };
            });
        };
        return true;
    }
}