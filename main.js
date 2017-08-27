window.createScrolly = function(scrollySelector) {
    var scrollyEl = d3.select('.scrolly');
    var vizEl = d3.select('.scrolly__viz');
    // var proseEl = d3.select('.scrolly__prose');

    // defining any preliminary values
    var margin = {top:60, right:60, bottom:60, left:60};
    // render size according to size of viz's bounding div
    var boundingWidth = d3.select('.viz--1').node().getBoundingClientRect().width;
    var size = boundingWidth < 500 ? boundingWidth : 500;
    var vizSize = size - margin.top - margin.bottom;
    var circleSize = 20;
    var rectSize = vizSize/9.0;

    var position = d3.scaleLinear()
                        .domain([0, 9])
                        .range([0, vizSize]);
    var rectPosition = d3.scaleBand()
                            .domain(d3.range(10))
                            .range([0, vizSize]);
    var data = randomizeArray(d3.range(100)); // 100 circles representing the population
    // determine which 9 circles will yield a false positive result
    var falsePositives = data.slice(1, 10);
    console.log(falsePositives);
    console.log(data[0]);
    // transition customizations
    // slider scales
    var diseaseScale = d3.scaleLinear()
                                .domain([0.1, 100.0])
                                .range([0, vizSize-65])
                                .clamp(true);
    var falsepositiveScale = d3.scaleLinear()
                            .domain([0.1, 100.0])
                            .range([0, vizSize-65])
                            .clamp(true);
    var rectScale = d3.scaleLinear()
                        .domain([0.0, 100.0])
                        .range([0, vizSize]);
    // storing values for slider
    var diseaseValue = 0.01;
    var falsepositiveValue = 0.09;

    // actions to take on each step of our scroll-driven story
    var steps = [
        // function step0() {
        //     var viz = vizEl.select('svg g');
        //     var elements = viz.selectAll('rect');
        //
        //     elements.transition().delay(function(d, i) { return i*10; })
        //         .attr('opacity', 0);
        // },

        function step1() {
            var elements = d3.selectAll('.el');
            // randomize position of circles
            elements.transition().duration(1000)
                .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
                .attr('x', function(d, i) { return position(d%10) - circleSize/2; })
                .attr('fill', '#E0F2F1')
                .attr('stroke', '#B2DFDB')
                .attr('width', circleSize)
                .attr('height', circleSize)
                .attr('rx', circleSize)
                .attr('ry', circleSize)
                .attr('opacity', 1.0);
            // elements.transition().delay(function(d, i) { return i*10; })
            //     .attr('opacity', 1.0);
        },

        function step2() {
            var elements = d3.selectAll('.el');
            elements.transition().duration(1000)
                .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
                .attr('x', function(d, i) { return position(d%10) - circleSize/2; })
                .attr('width', circleSize)
                .attr('rx', circleSize)
                .attr('ry', circleSize)
                .attr('opacity', 1.0);

            d3.selectAll('.false-positive').transition().duration(1000)
                        .attr('fill', '#E0F2F1')
                        .attr('stroke', '#B2DFDB');

            d3.selectAll('.disease').transition().duration(1000)
                        .attr('fill', '#EF9A9A')
                        .attr('stroke', '#E57373');
        },

        function step3() {
            var elements = d3.selectAll('.el');

            elements.transition().duration(1000)
                .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
                .attr('x', function(d, i) { return position(d%10) - circleSize/2; })
                .attr('width', circleSize)
                .attr('rx', circleSize)
                .attr('ry', circleSize)
                .attr('opacity', 1.0);

            d3.select('.screen').transition().duration(1000)
                .attr('x', -(size+40));

            d3.selectAll('.disease').transition().duration(1000)
                        .attr('fill', '#EF9A9A')
                        .attr('stroke', '#E57373');
            d3.selectAll('.false-positive').transition().duration(1000)
                        .attr('fill', '#E0F2F1')
                        .attr('stroke', '#B2DFDB');

        },

        function step4() {
            var elements = d3.selectAll('.el');
            var t = d3.transition()
                        .duration(1000)
                        .ease(d3.easeQuadInOut);
            d3.selectAll('.false-positive').transition().duration(1000)
                .attr('rx', circleSize)
                .attr('ry', circleSize)
                .attr('stroke', '#FFD54F')
                .attr('width', circleSize)
                .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
                .attr('x', function(d, i) { return position(d%10) - circleSize/2; })
                .attr('opacity', 1.0);
            d3.select('.disease').transition().duration(1000)
                .attr('rx', circleSize)
                .attr('ry', circleSize)
                .attr('stroke', '#E57373')
                .attr('width', circleSize)
                .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
                .attr('x', function(d, i) { return position(d%10) - circleSize/2; });
            d3.select('.interactive')
                .style('display', 'none')
                .transition(1000)
                .attr('opacity', 0);



            d3.select('.screen').transition(t)
                .attr('opacity', 1.0)
                .attr('x', 20);

            elements.each(function(d) {
                var el = d3.select(this);
                if (el.attr('class') == 'el') {
                    el.transition().delay(1000).duration(1000)
                        .attr('opacity', 0.4);
                }
            });

            d3.selectAll('.false-positive').transition().delay(1000).duration(1000)
                        .attr('fill', '#FFE082')
                        .attr('stroke', '#FFD54F');



        },

        function step5() {
            var elements = d3.selectAll('.el');
            var t = d3.transition()
                        .duration(1000)
                        .ease(d3.easeQuadInOut);
            // fade out screen
            d3.select('.screen').transition().duration(1000)
                .attr('opacity', 0);
            // fade out green dots
            elements.each(function(d) {
                var el = d3.select(this);
                if (el.attr('class') == 'el') {
                    el.transition().duration(1000)
                        .attr('opacity', 0);
                }
            });
            // shift the remaining dots
            d3.selectAll('.false-positive').transition(t).delay(function(d, i) { return i*50+1000; })
                .attr('rx', 0)
                .attr('ry', 0)
                .attr('stroke', 'none')
                .attr('fill', '#FFE082')
                .attr('width', rectPosition.bandwidth())
                .attr('y', 60)
                .attr('x', function(d, i) { return rectPosition(i); })
                .transition().duration(0).delay(450)
                .attr('width', function(d, i) { return i===0 ? rectPosition.bandwidth()*9 : rectPosition.bandwidth(); })
                .attr('opacity', function(d, i) { return i===0 ? 1.0 : 0.0;});
            d3.select('.disease').transition(t).delay(1000)
                .attr('rx', 0)
                .attr('ry', 0)
                .attr('fill', '#EF9A9A')
                .attr('stroke', 'none')
                .attr('width', rectPosition.bandwidth())
                .attr('y', 60)
                .attr('x', rectPosition(9))
                .transition().duration(0).delay(450)
                .attr('width', vizSize)
                .attr('x', rectPosition(0));

            // render the slider/interactive portion
            d3.select('.interactive')
                .style('display', 'block')
                .transition(1000).delay(2450)
                .attr('opacity', 1.0);
            // set default values


        },
    ];

    // array randomizer function
    function randomizeArray(array) {
        var m = array.length;
        var t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    // update function for the viz
    function update(step) {
        // console.log(steps[step]);
        steps[step]();
    }

    // helper function for string concat for translation in transform attr
    function translate(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

    // setting up of the visualization
    function setupViz() {
        var svg = vizEl.select('.viz--1').append('svg')
                        .attr('width', size)
                        .attr('height', size);

        // rect screen
        svg.append('rect').classed('screen', true)
            .attr('width', size-40)
            .attr('height', size-40)
            .attr('x', -(size+40))
            .attr('y', 20)
            .attr('fill', '#FAFAFA')
            .attr('stroke', '#9E9E9E')
            .attr('opacity', 0.5);


        var viz = svg.append('g')
                        .attr('transform', 'translate('+margin.left+','+margin.top+')');




        // 10 x 10 matrix of circles
        viz.selectAll('.el')
            .data(data)
            .enter()
            .append('rect').classed('el', true)
            // identify element with the disease
            .classed('disease', function(d) { return d==data[0]; })
            // identify false positives
            .classed('false-positive', function(d) { return falsePositives.indexOf(d) != -1; })
            .attr('y', function(d, i) { return position(Math.floor(d/10)) - circleSize/2; })
            .attr('x', function(d, i) { return position(d%10) - circleSize/2; })
            .attr('width', circleSize)
            .attr('height', circleSize)
            .attr('rx', circleSize)
            .attr('ry', circleSize)
            .attr('fill', '#E0F2F1')
            .attr('stroke', '#B2DFDB')
            .attr('opacity', 0);

        // interactive labels and slider
        var interactive = viz.append('g').attr('class', 'interactive')
                        .attr('transform', translate(0, 100))
                        .attr('opacity', 0)
                        .style('display', 'none');
        var statFalsePositive = interactive.append('g').attr('class', 'stat stat--falsepositive');
        statFalsePositive.append('text').text('90%')
                            .attr('y', 25)
                            .attr('fill', '#FFD54F');
        statFalsePositive.append('text').text('false positive');

        var statDisease = interactive.append('g').attr('class', 'stat stat--disease')
                                    .attr('transform', translate(vizSize-50, 0));
        statDisease.append('text').text('10%')
                            .attr('y', 25)
                            .attr('fill', '#E57373');
        statDisease.append('text').text('disease');

        // slider 1
        var slider1 = interactive.append('g')
                                    .attr('class', 'slider')
                                    .attr('transform', translate(0, 90));
        var slider1Value = slider1.append('text')
                .text('1.0%')
                .attr('x', vizSize)
                .attr('text-anchor', 'end');
        slider1.append('text')
                .text('rate of disease')
                .attr('y', -15);
        slider1.append("line")
                .attr("class", "track")
                .attr("x1", diseaseScale.range()[0])
                .attr("x2", diseaseScale.range()[1])
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-inset")
                    .attr('x1', diseaseScale(1.0))
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() { slider1.interrupt(); })
                    // update the values on drag
                    .on("start drag", function() {
                        var d = diseaseScale.invert(d3.event.x);
                        handle1.attr('cx', diseaseScale(d));
                        slider1Value.text(d.toFixed(1)+'%');
                        slider1.select('.track-inset')
                                .attr('x1', falsepositiveScale(d));
                        diseaseValue = d/100;
                        calculate();
                    }));
        var handle1 = slider1.insert('circle', '.track-overlay')
                            .attr('class', 'handle')
                            .attr('r', 5)
                            .attr('cx', diseaseScale(1.0));
        // slider 2
        var slider2 = interactive.append('g')
                                    .attr('class', 'slider')
                                    .attr('transform', translate(0, 150));
        var slider2Value = slider2.append('text')
                .text('9.0%')
                .attr('x', vizSize)
                .attr('text-anchor', 'end');
        slider2.append('text')
                .text('rate of false positives')
                .attr('y', -15);
        slider2.append("line")
                .attr("class", "track")
                .attr("x1", falsepositiveScale.range()[0])
                .attr("x2", falsepositiveScale.range()[1])
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-inset")
                    .attr('x1', falsepositiveScale(9.0))
                .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() { slider2.interrupt(); })
                    // update the values on drag
                    .on("start drag", function() {
                        var d = falsepositiveScale.invert(d3.event.x);
                        handle2.attr('cx', falsepositiveScale(d));
                        slider2.select('.track-inset')
                                .attr('x1', falsepositiveScale(d));
                        slider2Value.text(d.toFixed(1)+'%');
                        falsepositiveValue = d/100;
                        calculate();
                    }));
        var handle2 = slider2.insert('circle', '.track-overlay')
                            .attr('class', 'handle')
                            .attr('r', 5)
                            .attr('cx', falsepositiveScale(9.0));
        // set default values for slider
        calculate();

        function calculate() {
            var f = falsepositiveValue - falsepositiveValue*diseaseValue;
            var d = diseaseValue;

            var proportionFalsepositive = ((f/(d+f))*100).toFixed(1);
            var proportionDisease = (100.0 - proportionFalsepositive).toFixed(1);
            d3.select('.stat--falsepositive text').text(proportionFalsepositive+'%');
            d3.select('.stat--disease text').text(proportionDisease+'%');
            d3.select('.false-positive')
                        // .transition()
                        // .duration(1000)
                        // .ease(d3.easeQuadInOut)
                .attr('width', rectScale(proportionFalsepositive));
        }







    }

    // setting up of the prose portion
    function setupProse() {
        // defining the distance between each prose section
        var height = window.innerHeight;
        d3.selectAll('.prose__step')
                .style('padding-bottom', height*(2/3)+'px');
                // .style('padding-top', height/3 + 'px');
    }

    // initialization function
    function init() {
        setupViz();
        setupProse();
        // update(0);
    }

    init();

    return {
        update: update,
    };
};





// GRAPH-SCROLL SHIZZ
function graphScroll() {
    var scrollyEl = d3.select('.scrolly');
    var vizEl = d3.select('.scrolly__viz');
    var stepEl = scrollyEl.selectAll('.prose__step');

    var viewportHeight = window.innerHeight;
    var halfViewportHeight = viewportHeight / 2;

    // a global function that creates and handles all the viz + updates
    var scrolly = createScrolly('.scrolly');

    d3.graphScroll()
        .container(scrollyEl)
        .graph(vizEl)
        .sections(stepEl)
        // .offset(halfViewportHeight)
        // .offset(halfViewportHeight*2.8)
        .on('active', function(i) {
            scrolly.update(i);
        });
}

graphScroll();
