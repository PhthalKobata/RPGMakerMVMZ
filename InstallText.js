
//==========================================================================================
// InstallText.js
//------------------------------------------------------------------------------------------
// version
// 1.0.0 2023/1/15 初版
//------------------------------------------------------------------------------------------
// twitter: https://twitter.com/Kass_kobataku
// github : https://github.com/PhthalKobata
//==========================================================================================
/*:
 * @plugindesc シナリオをテキストから直接文章に表示するプラグイン
 * @author こばた ふたる
 * @target MZ
 * 
 * @command phk_installText_build
 * @text テキストファイルの読み込み
 * @desc テキストファイル名を指定して読み込みます。
 * 
 * @arg fileName
 * @text ファイル名
 * @type string
 * @desc テキストファイル名を読み込みます。txt以外は拡張子も必要です。
 * 
 * @command phk_installText_init
 * @text テキスト進行初期化
 * @desc テキストの進行を初期化、つまりテキストの最初からになります。
 * 
 * @command phk_installText_start
 * @text テキスト進行
 * @desc テキスト進行を開始または再開します。
 * 
 * @command phk_installText_end
 * @text テキスト終了
 * @desc テキスト進行を終了します。
 * 
 * @command phk_installText_jump
 * @text ラベルジャンプ
 * @desc 指定のラベルにジャンプします。
 * 
 * @arg labelName
 * @text ラベル名
 * @type string
 * @desc ジャンプするラベル名です。
 * 
 * @command phk_installText_destruct
 * @text テキストデータの解放
 * @desc テキストデータをプログラム上から無くします。（何か不都合が起こる場合に使用します）
 * 
 * @command phk_installText_debug
 * @text デバック
 * @desc デバックに使用するモードです。
 * 
 * @arg mode
 * @text モード選択
 * @type select
 * @option 今何番目の文章化のインデックスを表示します
 * @value index
 * @option テキスト進行の完了判定
 * @value done
 * 
 * @command phk_installText_convert
 * @text 変換テキスト出力
 * @desc 変数などを変換したテキストを出力します。
 * 
 * @arg fileName
 * @text ファイル名
 * @type string
 * @desc ファイル名を記述します。?は任意の一文字、*で任意の文字列を使用できます。
 * 
 * @param path
 * @text 参照フォルダ名
 * @type string
 * @default document 
 * 
 * @param activate
 * @text パラメーター有効化
 * @type struct<activateConfig>
 * @default {"act_textTag":"true","act_eventTag":"true","act_windowTag":"true","act_commentTag":"true","act_variable":"true","act_color":"true","act_unicode":"true","act_eventConfig":"true","act_windowConfig":"true"}
 * 
 * @param definition
 * @text 定義
 * 
 * @param textTag
 * @text テキストタグ
 * @parent definition
 * @type struct<textTag>
 * @default {"variable":"$v","unicode":"$u","color":"$c"}
 * 
 * @param eventTag
 * @text イベントタグ
 * @parent definition
 * @type struct<eventTag>
 * @default {"event":"#e","label":"#l"}
 * 
 * @param windowTag
 * @text ウィンドウタグ
 * @parent definition
 * @type struct<windowTag>
 * @default {"windowBack":"!b","windowPotion":"!p","faceImage":"!f","speakerName":"!s"}
 * 
 * @param commentTag
 * @text コメントタグ
 * @parent definition
 * @type struct<commentTag>
 * @default {"commentOut":"//"}
 * 
 * @param tagConfig
 * @text テキストタグ設定
 * 
 * @param variable
 * @text テキスト変数の設定
 * @parent tagConfig
 * @type string[]
 * @default []
 * 
 * @param color
 * @text 色制御文字の設定
 * @parent tagConfig
 * @type string[]
 * @default []
 * 
 * @param unicode
 * @text unicode文字の設定
 * @parent tagConfig
 * @type string[]
 * @default []
 * 
 * @param eventAndlabel
 * @text 一時停止・終了タグの設定
 * @parent tagConfig
 * @type struct<event>
 * @default {"stopScenario":"stop","endScenario":"end"}
 * 
 * @param windowAndPotion
 * @text テキストウィンドウの設定
 * @parent tagConfig
 * @type struct<window>
 * @default {"window_window":"通常","window_dark":"暗く","window_trans":"透明","potion_upper":"上","potion_middle":"中","potion_lower":"下"}
 * 
 * 
 * @help 
 * This is released under the MIT Licence.
 * このプラグインは作者に無断で改変可能です。
 * 同人・商業・18禁、有償作品などいかなる形態の作品にも利用できます。
 * RPGツクール(RPG Maker) MV/MZに対応しています。
 * 
 * プラグインコマンド
 * phk_installText build ファイル名  : テキストを読み込みプログラムを立ち上げ初期化
 * phk_installText init             : シナリオ進行を初期化（テキストの最初からに）する
 * phk_installText start            : シナリオ進行を開始・stopの後から再開
 * phk_installText jump ラベル名     : labelに飛ぶ
 * phk_installText end              : シナリオ進行を終了
 * phk_installText destruct         : インスタンスの破棄
 * phk_installText debug index      : 何番目の文章またはタグを参照しているか
 * phk_installText debug done       : シナリオが進行しているかどうか
 * phk_installText_convert ファイル名: 指定のファイルのいテキスト変数などを展開したtextを出力する
 * 
 * 【タグとコマンド】
 * 
 * テキストに記述するイベントタグの記法
 * #e{stop}    : シナリオの進行を一時的に抜ける
 * #l{ラベル名} : ラベル {} の中に任意のラベル名を入れる
 * #e{end}     : シナリオの終了
 * プラグインパラメータの「テキストタグ設定>一時停止・終了タグの設定」で#e{}の中身の記法を変更できます。
 * 
 * ツクールコマンドの記法
 * \v[4] (本文に直に書く場合はそのまま)
 * ただし後述する変数に入れる場合は\\v[4]とする。
 * 
 * 変数の使い方
 * プラグインパラメータの「テキストタグ設定>テキスト変数の設定」に記述します。
 * 記述方法は以下です。
 * プラグインパラメータでの設定　：主人公 = ハロルド
 * テキストでの変数の使用　　　　：$v{主人公}
 * パラメータには他のテキスト変数や制御文字も使用できます。
 * 例：　主人公2 = $c{赤}\\v[1]$c{白}($c{青}$v{変身状態}の姿$c{白})
 * このプラグインのdefaultParameterのvariableで直接設定もできます。
 * 
 * カラーコード
 * $c{blue}などで\C[n]を取得できます。
 * ツクールのカラーパレットを編集している人とか{}に入れる色の名前を変えたい人は
 * プラグインパラメータの「テキストタグ設定>色制御文字の設定」で設定を上書きできます。
 * 記述方法はテキスト変数の設定と同じです。
 * このプラグインのdefaultParameterのcolorを編集してもできます。
 * 
 * unicode文字の使用
 * $u{ハート}などで記述する事で文字化けのリスクを回避できます。
 * 16進数の文字コードを調べる必要がありますが、プラグインパラメータの「テキストタグ設定>unicode文字の設定」で設定できます。
 * 記述方法はテキスト変数の設定と同じです。
 * deefaultParameterのunicodeでも追加が可能です。
 * 他と同様にキーを編集すれば{}内に入れる文字も変更できます。
 * 
 * コメントアウト
 * //{コメントの中身}と記述すると、コメントアウト扱いになり文章に反映されません。
 * 文章中に挿入されていてもコメントアウトになります。
 * 例：あいう//{コメント}えお -> あいうえお
 * 
 * 【ウインドウに関するパラメーター】
 * このパラメーターは一度設定すると、変更されるまで設定が引き継がれます。
 * 例えばウインドウ表示を中央に設定すると、下に設定し直すまで中央に設定され続けます。
 * 
 * ウインドウ設定
 * !b{暗く} !p{上} などでウインドウを設定できます。
 * 設定を反映させたい文章の直前に記述してください。
 * {}内のデフォルトでは以下ですがプラグインパラメータの「テキストタグ設定>テキストウインドウの設定」で変更できます。
 * 通常・暗く・透明
 * 上・中・下
 * 
 * 顔グラの設定
 * !f{Actor1,4}のように{ファイル名,番号}で指定します。
 * 顔グラなしの場合は!f{,0}としてください。
 * 設定を反映させたい文章の直前に記述してください。
 * 
 * 名前欄の設定(MZのみ)
 * !s{なまえ}と指定すると名前欄に「なまえ」が表示されます。
 * 名前欄の表示を消すときは!s{}としてください。
 * MVで使用すると表示する文の先頭に追記されますので、4行の文章では改ページがずれます。
 * 
 * 
 * タグ記法の変更方法
 * タグの記法$vなどは変更可能です。
 * プラグインパラメータの「定義>○○タグ」で設定を変更できます。
 * 例えば$vを%hに書き換えれば%h{変数}に変化します。
 * ただし、複数項目でタグの名前が被ってもエラー検出されないので名前被りには注意してください。
 * また$$v{}と$v{}のような一部が被るパターンも回避してください。
 * 
 * 文章コンバートについて
 * このプラグインでゲームを作るとどうしてもテキストファイルがむき出しになります。（エニグマとか使えば別ですが）
 * テキストむき出しは嫌だという人のための機能として、文章コンバート機能を搭載しています。
 * これによって変換されたテキストをコピーして「文章の表示（一括入力）」でペーストできます。
 * ただしウインドウの設定は反映されないので注意してください。
 * 適当なイベントを作成して以下を設定、ゲームを起動してイベントを実行してください。
 * MV: phk_installText_convert ファイル名
 * MZ: 変換テキスト出力　ファイル名
 * ファイル名には*（任意の文字列）や?（任意の一文字）を使用できます。
 * 例えばファイル名を*.txtにするとテキストファイルすべてが一度に変換されます。
 * 出力されたファイルは!converted_○○です。
 * 
 * 
 * その他
 * ・このプラグインは文章とアクションを切り離して記述することを想定しています。
 * 　そのためツクール内での文章の閲覧はできません。
 * ・ビルドされたテキストは複数のイベント間での共有はできません。
 * 　イベントまたはコモンイベント毎にビルドしてください。
 * ・変数で変数名を生成するような記述は正常に作動しません。やらないでください。
 * 　例：いろは = $v{$v{いろは}にほ}$c{青}　など$v{$v{}}の形になるのはダメ。
 * ・変数の入れ子は可能です。
 * 　例：abc = aaabbbccc, def = dddeeefff, xyz = $v{abc}$v{def}
 *   $v{xyz} -> $v{abc}$v{def} -> aaabbbcccdddeeefff
 * ・やる人いないと思いますが、想定外なテキスト（1000万字の壮大なテキストなど）
 * 　イタズラめいた設定（変数を1万回入れ子するなど）ではバグることがあります。
 * 　また変数を循環参照すると動かなくなるので注意してください。
 * 　いろは = $v{ほへと}, ほへと = $v{いろは}　はダメ。
 * 
 * 
*/

/*~struct~textTag:
 * @param variable
 * @text テキスト変数タグ
 * @type string
 * @default $v
 * 
 * @param unicode
 * @text unicodeタグ
 * @type string
 * @default $u
 * 
 * @param color
 * @text 色タグ
 * @type string
 * @default $c
 */

/*~struct~eventTag:
 * @param event
 * @text イベントタグ
 * @type string
 * @default #e
 * 
 * @param label
 * @text ラベルタグ
 * @type string
 * @default #l
 */

/*~struct~windowTag:
 * @param windowBack
 * @text ウィンドウ背景タグ
 * @type string
 * @default !b
 * 
 * @param windowPotion
 * @text ウィンドウ位置タグ
 * @type string
 * @default !p
 * 
 * @param faceImage
 * @text 顔イメージタグ
 * @type string
 * @default !f
 * 
 * @param speakerName
 * @text 名前欄(MZのみ)
 * @type string
 * @default !s
 */

/*~struct~commentTag:
 * @param commentOut
 * @text コメントタグ
 * @type string
 * @default //
 */

/*~struct~event:
 * @param stopScenario
 * @text 一時停止
 * @type string
 * @default stop
 * 
 * @param endScenario
 * @text 終了
 * @type string
 * @default end
 */

/*~struct~window:
 * @param back_window
 * @text 背景：ウインドウ
 * @type string
 * @default 通常
 * 
 * @param back_dark
 * @text 背景：暗くする
 * @type string
 * @default 暗く
 * 
 * @param back_trans
 * @text 背景：透明
 * @type string
 * @default 透明
 * 
 * @param potion_upper
 * @text 位置：上
 * @type string
 * @default 上
 * 
 * @param potion_middle
 * @text 位置：中
 * @type string
 * @default 中
 * 
 * @param potion_lower
 * @text 位置：下
 * @type string
 * @default 下
 */

/*~struct~activateConfig:
 * @param act_textTag
 * @text テキストタグ
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_eventTag
 * @text イベントタグ
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_windowTag
 * @text ウィンドウタグ
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_commentTag
 * @text コメントタグ
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_variable
 * @text テキスト変数の設定
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_color
 * @text 色と制御文字変数の設定
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_unicode
 * @text unicode文字の設定
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_event
 * @text 一時停止・終了タグの設定
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * 
 * @param act_window
 * @text テキストウィンドウの設定
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 */



(() => {
    'use strict';

    /**=====================================================================================================
     * デフォルトのパラメーターオブジェクト。このオブジェクトを書き換えても設定は反映される。
     * これを別途jsonファイルにしたい場合はSettingPluginParameters.prototype.importTextparameterの
     * コメントアウトを有効化してthis._parameter = defaultParameterをコメントアウトする。
     * =====================================================================================================
     */

    const defaultParameter = {
        "definition": {
            "textTag": [
                {"type":"variable", "name":"$v"}, {"type":"unicode", "name":"$u"}, {"type":"color", "name":"$c"}
            ],
            "eventTag": [
                {"type":"event", "name":"#e"}, {"type":"label", "name":"#l"}           
            ],
            "windowTag": [
                {"type":"windowBack", "name":"!b"}, {"type":"windowPotion", "name":"!p"}, {"type":"faceImage", "name":"!f"}, {"type":"speakerName", "name":"!s"}
            ],
            "commentTag": [
                {"type":"commentOut", "name":"//"}
            ]
        },
        "color": {
            "white":"\\c[0]", "lightblue":"\\c[1]", "lightred":"\\c[2]", "lightgreen":"\\c[3]", "lightcyan":"\\c[4]", "lightpurple":"\\c[5]" ,"lightyellow":"\\c[6]" ,"gray":"\\c[7]",
            "silver":"\\c[8]", "blue":"\\c[9]", "red":"\\c[10]", "green":"\\c[11]", "sky":"\\c[12]", "purple":"\\c[13]" ,"yellow":"\\c[14]", "black":"\\c[15]",
            "aqua":"\\c[16]", "lemon":"\\c[17]", "scarlet":"\\c[18]", "navy":"\\c[19]", "orange":"\\c[20]", "gold":"\\c[21]", "cobalt":"\\c[22]", "cyan":"\\c[23]",
            "lightlime":"\\c[24]", "brown":"\\c[25]", "wistaria":"\\c[26]", "pink":"\\c[27]", "darkgreen":"\\c[28]", "lime":"\\c[29]","darkpurple":"\\c[30]", "violet":"\\c[31]",
            "白":"\\c[0]", "薄青":"\\c[1]", "薄赤":"\\c[2]", "薄緑":"\\c[3]", "ライトシアン":"\\c[4]", "薄紫":"\\c[5]" ,"浅黄":"\\c[6]" ,"灰":"\\c[7]",
            "銀":"\\c[8]", "青":"\\c[9]", "赤":"\\c[10]", "緑":"\\c[11]", "空":"\\c[12]", "紫":"\\c[13]" ,"黄":"\\c[14]", "黒":"\\c[15]",
            "水":"\\c[16]", "レモン":"\\c[17]", "緋":"\\c[18]", "紺":"\\c[19]", "オレンジ":"\\c[20]", "金":"\\c[21]", "コバルト":"\\c[22]", "シアン":"\\c[23]",
            "ライトライム":"\\c[24]", "茶":"\\c[25]", "藤":"\\c[26]", "ピンク":"\\c[27]", "濃緑":"\\c[28]", "ライム":"\\c[29]","濃紫":"\\c[30]", "菫":"\\c[31]"
        },
        "unicode": {
            "スペード":"\u2660", "クローバー":"\u2663", "ハート":"\u2665", "ダイヤ":"\u2666",
            "スペード白":"\u2664", "クローバー白":"\u2667", "ハート白":"\u2661", "ダイヤ白":"\u25C7",
            "スペード黒":"\u2660", "クローバー黒":"\u2663", "ハート黒":"\u2665", "ダイヤ黒":"\u2666",
            "black spade":"\u2660", "black club":"\u2663", "black heart":"\u2665", "black diamond":"\u2666",
            "white spade":"\u2664", "white club":"\u2667", "white heart":"\u2661", "white diamond":"\u25C7",
            "spade":"\u2660", "club":"\u2663", "heart":"\u2665", "diamond":"\u2666"
        },
        "variable": {
            
        },
        "event": {
            "stop":"stopScenario", "end":"endScenario"
        },
        "windowBack": {
            "通常":0, "暗く":1, "透明":2
        },
        "windowPotion": {
            "下":2, "中":1, "上":0
        }
    };

    const currentDir = (() => {
        const path = require('path');
        return path.dirname(process.mainModule.filename);
    })();

    /**=====================================================================================================
     * プラグインの設定をdefautlParameterに反映させる処理
     * =====================================================================================================
     */
    class SettingPluginParameters {
        constructor(){
            this.initialize.call(this);
        };

        initialize(){
            this.importTextparameter();
            this.importPluginParameter();
        };

        importTextparameter(){
            /*
            const fs = require('fs');
            try{
                let _parameterText = fs.readFileSync(`${currentDir}/data/installTextParameter.json`, 'utf-8');
                this._parameter = JSON.parse(_parameterText);    
            }
            catch(e){
                throw e;
            };
            */
           this._parameter = defaultParameter;
        };

        importPluginParameter(){
            const pluginName = document.currentScript.src.split('/').pop().replace(/.js$/, '');
            this._pluginParams = PluginManager.parameters(pluginName);
        };

        updateTag(keyArray, tagName){
            const pluginValue = JSON.parse(this._pluginParams[tagName]);
            const newTag = keyArray.map((value) => {
                return {type:value, name:pluginValue[value]};
            });
            let reg = new RegExp(`^${keyArray.join('$|^')}$`);
            const deletedTag = this._parameter.definition[tagName].filter((obj) => {
                return !reg.test(obj.type);
            });
            this._parameter.definition[tagName] = [...deletedTag, ...newTag];
        };

        updateTextParam(tagType){
            const pluginValue = JSON.parse(this._pluginParams[tagType]);
            pluginValue.forEach((value) => {
                const keyValue = value.replace(/ *= */, '=').split('=');
                if(keyValue.length === 2){
                    this._parameter.variable[keyValue[0]] = keyValue[1];
                };
            });
        };

        updateEventParam(){
            const pluginValue = JSON.parse(this._pluginParams.eventAndlabel);
            if(pluginValue.stopScenario !== pluginValue.endScenario){
                this._parameter.event[pluginValue.stopScenario] = 'stopScenario';
                this._parameter.event[pluginValue.endScenario] = 'endScenario';    
            };
        };

        updateWindowParam(){
            const pluginValue = JSON.parse(this._pluginParams.windowAndPotion);
            const back = [pluginValue.back_window, pluginValue.back_dark, pluginValue.back_trans];
            if(!this.existSameValue(back)){
                back.forEach((value, index) => {
                    this._parameter.windowBack[value] = index;
                });
            };

            const potion = [pluginValue.potion_upper, pluginValue.potion_middle,pluginValue.potion_lower];
            if(!this.existSameValue(potion)){
                potion.forEach((value, index) => {
                    this._parameter.windowPotion[value] = index;
                });
            };
        };

        existSameValue(array){
            if(Array.isArray(array)){
                const setObj = new Set(array.map(value => JSON.stringify(value)));
                return setObj.size !== array.length;
            }
            else{
                return false;
            };
        };

        updateEachParam(){
            const pluginValue = JSON.parse(this._pluginParams.activate);
            if(pluginValue.act_textTag){
                this.updateTag(['variable', 'unicode', 'color'], 'textTag');
            };
            if(pluginValue.act_eventTag){
                this.updateTag(['event', 'label'], 'eventTag');
            };
            if(pluginValue.act_windowTag){
                this.updateTag(['windowBack', 'windowPotion', 'faceImage', 'speakerName'], 'windowTag');
            };
            if(pluginValue.act_commentTag){
                this.updateTag(['commentOut'], 'commentTag');
            };
            if(pluginValue.act_variable){
                this.updateTextParam('variable');
            };
            if(pluginValue.act_color){
                this.updateTextParam('color');
            };
            if(pluginValue.act_unicode){
                this.updateTextParam('unicode');
            };
            if(pluginValue.act_event){
                this.updateEventParam();
            };
            if(pluginValue.act_window){
                this.updateWindowParam();
            };
        };

        parameters(){
            this.updateEachParam();
            return this._parameter;
        };

        path(){
            return `/${this._pluginParams.path}/`;
        };
    };

    const settingPluginParameters = new SettingPluginParameters();
    const textPath = settingPluginParameters.path();
    const parameters = settingPluginParameters.parameters();

    /**=====================================================================================================
     * テキストを読み込んで改ページごとの配列に変えるクラス
     * textName: 読み込みたいテキストファイル名
     * =====================================================================================================
     */

    class ImportText {
        constructor(textName){
            this._parameter = parameters;
            this.initialize.call(this, textName);
        };

        initialize(textName){
            this._textName = textName;
            this.importTextFile();
        };

        importTextFile(){
            const fs = require('fs');
            const textdir = `${currentDir}${textPath}${this._textName}${/\..*?$/.test(this._textName) ? '' : '.txt'}`;
            if(!fs.existsSync(textdir)){
                throw new Error(`${textdir} is not found`);
            };
            this._text = fs.readFileSync(textdir, 'utf-8');
        };

        addEscape(text){
            return text.replace(/[.*?+^${}()|[\]\\]/g, '\\$&');
        };

        //変数、color、unicodeの変換
        convert(tagType, tagName, text){
            let matchReg = new RegExp(`${tagName}\\{(.*?)\\}`, 'g');
            let matchedArray = text.match(matchReg);
            if(matchedArray === null){
                return text;
            }
            else{
                let convertText = matchedArray.reduce((pString, cValue) => {
                    let value = cValue.replace(matchReg, '$1');
                    let reg = new RegExp(`${tagName}\\{${value}\\}`, 'g');
                    return pString.replace(reg, this._parameter[tagType][value]);
                }, text);
                return this.convert(tagType, tagName, convertText);
            };
        };

        //変数、color、unicodeの変換
        convertTextTag(text){
            let textTag = this._parameter.definition.textTag;
            return textTag.reduce((pString, cObj) => {
                let tagName = this.addEscape(cObj.name);
                return this.convert(cObj.type, tagName, pString);
            }, text);
        };

        //コメントアウトの削除
        deleteCommentout(text){
            let commentTag = this._parameter.definition.commentTag;
            return commentTag.reduce((pString, cObj) => {
                let tagName = this.addEscape(cObj.name);
                let reg = new RegExp(`${tagName}\\{.*?\\}`, 'g');
                return pString.replace(reg, '');
            }, text);
        };

        //テキストを分割して配列にする
        textSplit(text){
            let eventReg  = this._parameter.definition.eventTag.map(obj => `${this.addEscape(obj.name)}\\{.*?\\}`).join('|');
            let windowReg = this._parameter.definition.windowTag.map(obj => `${this.addEscape(obj.name)}\\{.*?\\}`).join('|');
            let reg = new RegExp(`(${eventReg}|${windowReg})`, 'g');
            let textArray = text.replace(reg, '\n\n$1\n\n').replace(/^(\n|\r|\t)+|(\n|\r|\t)+$|\r|\t/g, '').replace(/\n\n+/g, '\\f').split('\\f');

            return textArray.map((value) => {
                let type = 'sentence';
                if(new RegExp(eventReg).test(value)){
                    type = 'eventTag';
                };
                if(new RegExp(windowReg).test(value)){
                    type = 'windowTag';
                };
                return {type:type, value:value};
            });
        };

        main(){
            let text1 = this.convertTextTag(this._text);
            let text2 = this.deleteCommentout(text1);
            this._textArray = this.textSplit(text2);
        };

        textArray(){
            return this._textArray;
        };

        textName(){
            this._textName;
        };
    };

    /**=====================================================================================================
     * 読み込んだテキストファイルからそのままエディタにコピペできるテキストを出力するクラス
     * textName : 読み込み/書き出したいテキストファイル名
     * =====================================================================================================
     */
    class ExportText {
        constructor(textName, depth = 0){
            this.initialize.call(this, textName, depth);
        };

        initialize(textName, depth){
            this._textName = textName;
            this._depth = depth;
            if(typeof this._textName !== 'string' || this._textName === ''){
                throw new Error('TextName is invalid');
            };
        };

        importTextFile(){
            const importText = new ImportText(this._textName);
            importText.main();
            this._textArray = importText.textArray();
        };

        createText(){
            this._text = this._textArray.reduce((pString, cObj) => {
                if(cObj.type === 'sentence'){
                    let n = 5 - cObj.value.split('\n').length;
                    pString += `${cObj.value}${Array.from({length:n}, () => '\n').join('')}`;
                };    
                return pString;
            }, '');
        };

        exportTextFile(){
            const fs = require('fs');
            fs.writeFileSync(`${currentDir}${textPath}!converted_${this._textName}${/\..*?$/.test(this._textName) ? '' : '.txt'}`, this._text);
        };

        convertAllFiles(){
            let reg = `^${this._textName.replace(/[.+^${}()[\]]/g, '\\$&').replace(/\?/g, '.').replace(/\*/g, '.*?')}$`;
            const fs = require('fs');

            fs.readdir(`${currentDir}${textPath}`, (err, files) => {
                if(err){
                    throw new Error('reference faild');
                };
                let compFiles = [];
                files.forEach((file) => {
                    if(fs.statSync(`${currentDir}${textPath}${file}`).isFile() && new RegExp(reg).test(file)){
                        const exportText = new ExportText(file, ++this._depth);
                        exportText.main();
                        compFiles.push(file);
                    };
                });
                $gameMessage.add(`${compFiles.length} files are converted`);
            });
        };

        main(){
            if(/\?|\*/.test(this._textName)){
                this.convertAllFiles();
            }
            else{
                this.importTextFile(this._textName);
                this.createText();
                this.exportTextFile();
                if(this._depth === 0){
                    $gameMessage.add(`${this._textName} is converted`);
                };
            };
        };
    };

    /**=====================================================================================================
     * 実際にテキストの中身を画面に表示するクラス
     * textArray  : ImportScenario で作成したtextArray
     * interpreter: Game_Interpreterインスタンスへの参照
     * =====================================================================================================
     */
    class InstallText {
        constructor(textArray, interpreter){
            this.initialize.call(this, textArray, interpreter);
        };

        //初期化
        initialize(textArray,interpreter){
            this._parameter    = parameters;
            this._textArray   = textArray;
            this._interpreter = interpreter;
            this._handler     = null;
            this._done        = true;
            this._index       = -1;
            this._windowParam = {back:0, potion:2, faceImage:['', 0], speakerName:''};
            this.initWindowParam();
        };

        //ウィンドウ設定の初期化
        initWindowParam(){
            $gameMessage.setBackground(0);
            $gameMessage.setPositionType(2);
        };

        //ジェネレーター
        *generator(){
            let index = 0;
            let lastIndex = this._textArray.length;
            let type, value, eventCmd;
            yield -1;
            while(index < lastIndex){
                eventCmd = '';
                type = this._textArray[index].type;
                value = this._textArray[index].value;
                switch(type){
                    case 'sentence':
                        this.showSentence(value);
                        break;
                    case 'eventTag':
                        eventCmd = this.eventCommand(value);
                        break;
                    case 'windowTag':
                        this.changeWindowParam(value);
                        yield index;
                        break;
                };
                if(eventCmd === 'stopScenario'){
                    let nextCmd = yield index;
                    if(nextCmd === 'end'){
                        break;
                    };
                    if(/^jump\{.*?\}$/.test(nextCmd)){
                        index = this.labeljump(nextCmd, index);
                    };                    
                };
                if(eventCmd === 'endScenario'){
                    break;
                };
                index++;
            };
            return -1;
        };

        //引数の解析
        tagAnalysis(param){
            return {
                name:  param.replace(/\{.*?\}/g, ''),
                value: param.match(/\{(.*?)\}/)[1]
            };
        };

        //ウィンドウの設定の変更
        changeWindowParam(param){
            const tags = this.tagAnalysis(param);
            const def = this._parameter.definition.windowTag.find(obj => obj.name === tags.name);
            if(def !== undefined){
                let newParam;
                switch(def.type){
                    case 'windowBack':
                        newParam = this._parameter[def.type][tags.value];
                        if(newParam !== undefined){
                            this._windowParam.back = newParam;
                        };
                    break;
                    case 'windowPotion':
                        newParam = this._parameter[def.type][tags.value];
                        if(newParam !== undefined){
                            this._windowParam.potion = newParam;
                        };
                    break;
                    case 'faceImage':
                        this._windowParam.faceImage = tags.value.replace(/, +/g, ',').split(',');
                    break;
                    case 'speakerName':
                        this._windowParam.speakerName = tags.value;
                    break;
                };
                this._interpreter._index -= 1;
            };
        };

        //イベントタグからコマンドを返す
        eventCommand(param){
            const tags = this.tagAnalysis(param);
            const def = this._parameter.definition.eventTag.find(obj => obj.name === tags.name);
            let cmd = '';
            if(def !== undefined){
                if(def.type === 'event'){
                    cmd = this._parameter.event[tags.value];
                };
                if(def.type === 'label'){
                    cmd = 'label';
                };
            };
            return cmd;
        };

        //ジャンプするラベルの場所を返す
        labeljump(param, index){
            const tags = this.tagAnalysis(param);
            const def  = this._parameter.definition.eventTag.find(obj => obj.type === 'label');
            let labelIndex = this._textArray.findIndex(obj => obj.value === `${def.name}{${tags.value}}`);
            if(labelIndex === -1){
                return index;
            }
            else{
                return labelIndex;
            };
        };

        //文章の表示
        showSentence(value){
            $gameMessage.newPage();
            $gameMessage.setBackground(this._windowParam.back);
            $gameMessage.setPositionType(this._windowParam.potion);
            $gameMessage.setFaceImage(...this._windowParam.faceImage);
            let showText = value;
            if(typeof $gameMessage.setSpeakerName === 'function'){
                $gameMessage.setSpeakerName(this._windowParam.speakerName);
            }
            else{
                if(this._windowParam.speakerName !== ""){
                    showText = `${this._windowParam.speakerName}\\c[0]\n${value}`;
                };
            };
            $gameMessage.add(showText);
            this._interpreter.setWaitMode('message');
        };

        //メイン
        main(nextCmd){
            let result;
            if(nextCmd === 'init'){
                this._handler = this.generator();
                result = this._handler.next();
            };
            if(/^jump\{.*?\}$|^start$|^end$/.test(nextCmd) && !this._done){
                result = this._handler.next(nextCmd);
            };
            if(result === undefined || result === null){
                this._done = true;
                this._value = -1;
            }
            else{
                this._done  = result.done;
                this._index = result.value;    
            };
            if(this._done){
                this._handler = null;
            };
        };

        //参照している文章の番号
        index(){
            return this._index;
        };

        //シナリオが進行しているかどうか
        done(){
            return `シナリオは進行して${(this._done ? 'ません' : 'ます')}`;
        };
    };

    /**=====================================================================================================
     * MVのプラグインコマンドの追加
     * =====================================================================================================
     */

    const _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args){
        _pluginCommand.apply(this, arguments);
        if(command.toLowerCase() === 'phk_installtext'){
            if(this.installText === undefined){
                this.installText = null;
            };
            let arg0 = args[0].toLowerCase();
            if(arg0 === 'build' && args[1] !== undefined){
                const importText = new ImportText(args[1]);
                importText.main();
                this.installText = new InstallText(importText.textArray(), this);
                this.installText.main('init');
            };
            if(/^jump$|^start$|^end$|^init$/.test(arg0) && this.installText !== null){
                this.installText.main(`${arg0}${(arg0 === 'jump' ? '{' + args[1] + '}' : '')}`);
            };
            if(arg0 === 'destruct'){
                this.installText = null;
            };
            if(arg0 === 'debug'){
                if(this.installText === null){
                    $gameMessage.add('Not built.');
                }
                else{
                    if(args[1] === 'index'){
                        $gameMessage.add(this.installText.index());
                    };
                    if(args[1] === 'done'){
                        $gameMessage.add(this.installText.done());
                    };
                };
            };
            if(arg0 === 'convert'){
                const exportText = new ExportText(args[1]);
                exportText.main();
            };
        };
    };

    /**
     * =====================================================================================================
     * MZのプラグインコマンドの追加
     * =====================================================================================================
     */
    if(typeof PluginManager.registerCommand === 'function'){
        PluginManager.registerCommand('InstallText', 'phk_installText_build', function(args){
            if(this.installText === undefined){
                this.installText = null;
            };
            if(args.fileName !== undefined){
                const importText = new ImportText(args.fileName);
                importText.main();
                this.installText = new InstallText(importText.textArray(), this);
                this.installText.main('init');
            };
        });

    
        PluginManager.registerCommand('InstallText', 'phk_installText_init', function(){
            if(this.installText !== null && this.installText !== undefined){
                this.installText.main('init');
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_start', function(){
            if(this.installText !== null && this.installText !== undefined){
                this.installText.main('start');
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_end', function(){
            if(this.installText !== null && this.installText !== undefined){
                this.installText.main('end');
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_jump', function(args){
            if(this.installText !== null && this.installText !== undefined){
                this.installText.main(`jump{${args.labelName}}`);
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_destruct', function(){
            if(this.installText !== null && this.installText !== undefined){
                this.installText = null;
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_debug', function(args){
            if(this.installText === null){
                $gameMessage.add('Not built.');
            }
            else{
                if(args.mode === 'index'){
                    $gameMessage.add(this.installText.index());
                };
                if(args.mode === 'done'){
                    $gameMessage.add(this.installText.done());
                };
            };
        });

        PluginManager.registerCommand('InstallText', 'phk_installText_convert', function(args){
            const exportText = new ExportText(args.fileName);
            exportText.main();
        });
    };

})();

